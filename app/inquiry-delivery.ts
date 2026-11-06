export type BrowserDelivery = { endpoint: string; fields: Record<string, string> };

export async function deliveryTokenHash(token: string) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return Array.from(new Uint8Array(bytes), byte => byte.toString(16).padStart(2, "0")).join("");
}

export function browserDelivery(recipient: string, origin: string, inquiry: {
  id: string; name: string; company: string; email: string; category: string; message: string;
}): BrowserDelivery {
  return {
    endpoint: `https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`,
    fields: {
      _subject: `[lubrAIn 문의] ${inquiry.category} · ${inquiry.company}`,
      _template: "table", _url: `${origin}/contact`, _replyto: inquiry.email,
      name: inquiry.name, email: inquiry.email,
      "접수 ID": inquiry.id, "회사": inquiry.company,
      "문의 분야": inquiry.category, "문의 내용": inquiry.message,
    },
  };
}
