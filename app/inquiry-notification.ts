type MailSettings = {
  INQUIRY_EMAIL_PROVIDER?: string;
  INQUIRY_TO_EMAIL?: string;
  INQUIRY_FROM_EMAIL?: string;
  RESEND_API_KEY?: string;
};

export type InquiryMail = {
  id: string;
  name: string;
  company: string;
  email: string;
  category: string;
  message: string;
  origin: string;
};

export type NotificationStatus = "not_configured" | "submitted" | "activation_pending" | "failed" | `failed_http_${number}` | "failed_response" | "failed_timeout" | "failed_network";

export function notificationConfigured(settings: MailSettings) {
  if (!settings.INQUIRY_TO_EMAIL) return false;
  if (settings.INQUIRY_EMAIL_PROVIDER === "formsubmit") return true;
  return (!settings.INQUIRY_EMAIL_PROVIDER || settings.INQUIRY_EMAIL_PROVIDER === "resend")
    && Boolean(settings.RESEND_API_KEY && settings.INQUIRY_FROM_EMAIL);
}

// Provider acceptance is not proof that a message reached the recipient's inbox.
export async function sendInquiryNotification(
  settings: MailSettings,
  inquiry: InquiryMail,
  send: typeof fetch = (input, init) => fetch(input, init),
): Promise<NotificationStatus> {
  if (!notificationConfigured(settings)) return "not_configured";
  const subject = `[lubrAIn 문의] ${inquiry.category} · ${inquiry.company}`;
  try {
    if (settings.INQUIRY_EMAIL_PROVIDER === "formsubmit") {
      const response = await send(`https://formsubmit.co/ajax/${encodeURIComponent(settings.INQUIRY_TO_EMAIL!)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json", "Referer": `${inquiry.origin}/contact` },
        signal: AbortSignal.timeout(12000),
        body: JSON.stringify({
          _subject: subject,
          _template: "table",
          _url: `${inquiry.origin}/contact`,
          _replyto: inquiry.email,
          name: inquiry.name,
          email: inquiry.email,
          "접수 ID": inquiry.id,
          "회사": inquiry.company,
          "문의 분야": inquiry.category,
          "문의 내용": inquiry.message,
        }),
      });
      if (!response.ok) {
        console.error("Inquiry email provider rejected request", { provider: "formsubmit", status: response.status });
        return `failed_http_${response.status}`;
      }
      const result = await response.json() as { success?: boolean | string; message?: string };
      if (typeof result.message === "string" && /needs? activation|activate (?:this |your |the )?form|confirm your email/i.test(result.message)) return "activation_pending";
      if (result.success === true || result.success === "true") return "submitted";
      console.error("Inquiry email provider did not accept request", { provider: "formsubmit", status: response.status });
      return "failed";
    }

    const response = await send("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${settings.RESEND_API_KEY}`, "Content-Type": "application/json", "Idempotency-Key": inquiry.id },
      signal: AbortSignal.timeout(12000),
      body: JSON.stringify({
        from: settings.INQUIRY_FROM_EMAIL,
        to: [settings.INQUIRY_TO_EMAIL],
        reply_to: inquiry.email,
        subject,
        text: `접수 ID: ${inquiry.id}\n이름: ${inquiry.name}\n회사: ${inquiry.company}\n이메일: ${inquiry.email}\n문의 분야: ${inquiry.category}\n\n${inquiry.message}`,
      }),
    });
    return response.ok ? "submitted" : "failed";
  } catch (error) {
    console.error("Inquiry email request failed", { provider: settings.INQUIRY_EMAIL_PROVIDER || "resend", errorType: error instanceof Error ? error.name : "unknown" });
    if (error instanceof SyntaxError) return "failed_response";
    if (error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")) return "failed_timeout";
    return "failed_network";
  }
}
