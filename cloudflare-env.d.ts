declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    BUCKET?: R2Bucket;
    RESEND_API_KEY?: string;
    INQUIRY_EMAIL_PROVIDER?: string;
    INQUIRY_TO_EMAIL?: string;
    INQUIRY_FROM_EMAIL?: string;
  }
}
