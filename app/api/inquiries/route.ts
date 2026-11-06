import { env } from "cloudflare:workers";
import { NextResponse } from "next/server";
import { inquiryLabels, stages } from "../../inquiry-options";
import { notificationConfigured, sendInquiryNotification } from "../../inquiry-notification";
import { browserDelivery, deliveryTokenHash } from "../../inquiry-delivery";

export const runtime = "edge";
const interests = new Set(Object.keys(inquiryLabels));
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function fail(message: string, status: number) { return NextResponse.json({ message }, { status }); }
function field(value: unknown, min: number, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max + 1) : "";
}

export async function POST(request: Request) {
  try {
    if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) return fail("요청 형식이 올바르지 않습니다.", 415);
    const origin = request.headers.get("origin");
    if (origin && origin !== new URL(request.url).origin) return fail("요청 출처를 확인할 수 없습니다.", 403);
    const raw = await request.text();
    if (raw.length > 6000) return fail("문의 내용이 너무 깁니다.", 413);
    const body = JSON.parse(raw) as Record<string, unknown>;
    if (field(body.website, 0, 200)) return NextResponse.json({ message: "문의가 접수되었습니다." });
    const name = field(body.name, 2, 80);
    const company = field(body.company, 2, 120);
    const email = field(body.email, 3, 254).toLowerCase();
    const interest = field(body.interest, 1, 30);
    const message = field(body.message, 20, 3000);
    const stage = field(body.stage, 0, 40);
    const context = field(body.context, 0, 500);
    if (stage && (interest !== "consulting" || !stages.includes(stage)) || context && (interest !== "cs-solution" || context.length > 500)) return fail("추가 입력 항목을 확인해 주세요.", 400);
    const storedMessage = [stage ? "현재 단계: " + stage : "", context ? "사용 도구: " + context : "", message].filter(Boolean).join("\n\n");
    const startedAt = Number(body.startedAt);
    const requestId = field(body.requestId, 36, 36);
    if (name.length < 2 || name.length > 80 || company.length < 2 || company.length > 120 || !emailPattern.test(email) || email.length > 254 || !interests.has(interest) || message.length < 20 || message.length > 3000 || body.consent !== "yes" || !/^[0-9a-f-]{36}$/i.test(requestId)) return fail("필수 항목과 개인정보 동의를 확인해 주세요.", 400);
    if (!Number.isFinite(startedAt) || Date.now() - startedAt < 2500 || Date.now() - startedAt > 2 * 60 * 60 * 1000) return fail("양식을 새로 열고 다시 시도해 주세요.", 400);
    if ((storedMessage.match(/https?:\/\//gi) || []).length > 2) return fail("링크는 두 개 이하로 입력해 주세요.", 400);
    if (!env.DB) return fail("현재 문의를 저장할 수 없습니다. 잠시 후 다시 시도해 주세요.", 503);
    const now = Date.now();
    const browserMail = env.INQUIRY_EMAIL_PROVIDER === "formsubmit-browser" && Boolean(env.INQUIRY_TO_EMAIL);
    const token = field(body.deliveryToken, 36, 36);
    if (browserMail && !/^[0-9a-f-]{36}$/i.test(token)) return fail("양식을 새로 열고 다시 시도해 주세요.", 400);
    const tokenHash = browserMail ? await deliveryTokenHash(token) : null;
    const existing = await env.DB.prepare("SELECT * FROM inquiries WHERE id = ?").bind(requestId).first<{ id: string; name: string; company: string; email: string; interest: string; message: string; notification_status: string; notification_token_hash: string | null; created_at: number }>();
    if (existing) {
      if (!browserMail) return NextResponse.json({ message: "문의가 접수되었습니다." });
      if (existing.notification_token_hash !== tokenHash || now - existing.created_at > 2 * 60 * 60 * 1000) return fail("접수 정보를 확인할 수 없습니다.", 403);
      return NextResponse.json({ message: "문의가 접수되었습니다.", reference: requestId,
        delivery: existing.notification_status === "browser_accepted" ? undefined : browserDelivery(env.INQUIRY_TO_EMAIL!, new URL(request.url).origin, { ...existing, category: inquiryLabels[existing.interest] }),
      });
    }
    const recent = await env.DB.prepare("SELECT count(*) AS total FROM inquiries WHERE email = ? AND created_at > ?").bind(email, now - 60 * 60 * 1000).first<{ total: number }>();
    if ((recent?.total || 0) >= 3) return fail("짧은 시간에 문의가 여러 번 접수되었습니다. 잠시 후 다시 시도해 주세요.", 429);
    const notificationStatus = browserMail ? "awaiting_browser" : notificationConfigured(env) ? "pending" : "not_configured";
    await env.DB.prepare("INSERT INTO inquiries (id, created_at, name, company, email, interest, message, consent_at, notification_status, notification_token_hash) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").bind(requestId, now, name, company, email, interest, storedMessage, now, notificationStatus, tokenHash).run();
    if (browserMail) return NextResponse.json({ message: "문의가 접수되었습니다.", reference: requestId,
      delivery: browserDelivery(env.INQUIRY_TO_EMAIL!, new URL(request.url).origin, { id: requestId, name, company, email, category: inquiryLabels[interest], message: storedMessage }),
    });
    if (notificationStatus === "pending") {
      const status = await sendInquiryNotification(env, {
        id: requestId, name, company, email,
        category: inquiryLabels[interest], message: storedMessage,
        origin: new URL(request.url).origin,
      });
      await env.DB.prepare("UPDATE inquiries SET notification_status = ? WHERE id = ?").bind(status, requestId).run();
    }
    return NextResponse.json({ message: "문의가 접수되었습니다.", reference: requestId });
  } catch (error) {
    console.error("Inquiry submission failed", error instanceof Error ? error.message : "unknown error");
    return fail("접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.", 500);
  }
}

// A per-submission token permits reporting only this inquiry's browser result.
// This is a client report, not a provider delivery webhook.
export async function PATCH(request: Request) {
  try {
    if (!request.headers.get("content-type")?.includes("application/json")) return fail("요청 형식이 올바르지 않습니다.", 415);
    if (request.headers.get("origin") !== new URL(request.url).origin) return fail("요청 출처를 확인할 수 없습니다.", 403);
    const raw = await request.text();
    if (raw.length > 500) return fail("요청 내용이 너무 깁니다.", 413);
    const body = JSON.parse(raw) as Record<string, unknown>;
    const id = field(body.reference, 36, 36);
    const token = field(body.deliveryToken, 36, 36);
    const status = field(body.status, 1, 30);
    if (!/^[0-9a-f-]{36}$/i.test(id) || !/^[0-9a-f-]{36}$/i.test(token) || !["browser_accepted", "browser_failed", "activation_pending"].includes(status)) return fail("접수 정보를 확인할 수 없습니다.", 400);
    if (!env.DB) return fail("현재 처리 결과를 저장할 수 없습니다.", 503);
    const result = await env.DB.prepare("UPDATE inquiries SET notification_status = ? WHERE id = ? AND notification_token_hash = ? AND created_at > ? AND notification_status IN ('awaiting_browser', 'browser_failed', 'activation_pending')")
      .bind(status, id, await deliveryTokenHash(token), Date.now() - 2 * 60 * 60 * 1000).run();
    return result.meta.changes ? NextResponse.json({ recorded: true }) : fail("접수 정보를 확인할 수 없습니다.", 403);
  } catch {
    return fail("처리 결과를 기록하지 못했습니다.", 400);
  }
}
