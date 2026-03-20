import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.EMAIL_FROM ?? "HiringLens <hiringlensofficial@gmail.com>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "hiringlensofficial@gmail.com";

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  if (!resend) {
    console.log(`[Email] No RESEND_API_KEY — skipping email to ${to}: ${subject}`);
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error("[Email] Failed to send:", err);
  }
}

export async function sendAdminEmail(subject: string, html: string) {
  await sendEmail({ to: ADMIN_EMAIL, subject, html });
}

// ── Email Templates ──────────────────────────────────

export function submissionReceivedEmail(companyName: string, roleTitle: string) {
  return {
    subject: "Your interview experience has been submitted",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #111; margin-bottom: 16px;">Thanks for sharing your experience!</h2>
        <p style="color: #555; line-height: 1.6;">
          Your interview experience at <strong>${escapeHtml(companyName)}</strong> for the
          <strong>${escapeHtml(roleTitle)}</strong> role has been submitted and is pending review.
        </p>
        <p style="color: #555; line-height: 1.6;">
          Our team reviews submissions to ensure quality and compliance with our guidelines.
          You'll receive an email when your review is published.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #999; font-size: 13px;">
          The HiringLens Team
        </p>
      </div>
    `,
  };
}

export function submissionApprovedEmail(companyName: string, companySlug: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hiringlens.vercel.app";
  return {
    subject: "Your interview experience has been published",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #111; margin-bottom: 16px;">Your review is live!</h2>
        <p style="color: #555; line-height: 1.6;">
          Your interview experience at <strong>${escapeHtml(companyName)}</strong> has been
          approved and is now visible on HiringLens.
        </p>
        <p style="margin: 24px 0;">
          <a href="${siteUrl}/company/${companySlug}"
             style="background: #111; color: #fff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-size: 14px;">
            View on HiringLens
          </a>
        </p>
        <p style="color: #555; line-height: 1.6;">
          Thank you for helping others make informed decisions about their careers.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #999; font-size: 13px;">
          The HiringLens Team
        </p>
      </div>
    `,
  };
}

export function submissionRejectedEmail(companyName: string) {
  return {
    subject: "Update on your submitted interview experience",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #111; margin-bottom: 16px;">Review update</h2>
        <p style="color: #555; line-height: 1.6;">
          Your interview experience at <strong>${escapeHtml(companyName)}</strong>
          was not published as it didn't meet our content guidelines.
        </p>
        <p style="color: #555; line-height: 1.6;">
          Common reasons include incomplete information, inappropriate language,
          or content that could identify individuals. You're welcome to submit a
          revised version.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #999; font-size: 13px;">
          The HiringLens Team
        </p>
      </div>
    `,
  };
}

export function adminNewPendingEmail(companyName: string, roleTitle: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hiringlens.vercel.app";
  return {
    subject: `[HiringLens] New submission: ${companyName} - ${roleTitle}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #111; margin-bottom: 16px;">New pending review</h2>
        <p style="color: #555; line-height: 1.6;">
          A new interview experience has been submitted for
          <strong>${escapeHtml(companyName)}</strong> (${escapeHtml(roleTitle)}).
        </p>
        <p style="margin: 24px 0;">
          <a href="${siteUrl}/admin"
             style="background: #111; color: #fff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-size: 14px;">
            Review in Admin
          </a>
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #999; font-size: 13px;">
          HiringLens Notifications
        </p>
      </div>
    `,
  };
}

// ── Company Representative Email Templates ──────────

export function repVerifiedEmail(companyName: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hiringlens.vercel.app";
  return {
    subject: `You're verified as a representative for ${escapeHtml(companyName)}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #111; margin-bottom: 16px;">Welcome to HiringLens!</h2>
        <p style="color: #555; line-height: 1.6;">
          You've been verified as a representative for <strong>${escapeHtml(companyName)}</strong>.
          You can now respond to candidate reviews about your company.
        </p>
        <p style="margin: 24px 0;">
          <a href="${siteUrl}/company-dashboard"
             style="background: #111; color: #fff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-size: 14px;">
            Open Company Dashboard
          </a>
        </p>
        <p style="color: #555; line-height: 1.6;">
          Your responses will be reviewed by our team before being published.
          Please keep replies professional and constructive.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #999; font-size: 13px;">
          The HiringLens Team
        </p>
      </div>
    `,
  };
}

export function adminNewResponseEmail(companyName: string, roleTitle: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hiringlens.vercel.app";
  return {
    subject: `[HiringLens] New company response: ${companyName}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #111; margin-bottom: 16px;">New company response pending review</h2>
        <p style="color: #555; line-height: 1.6;">
          A representative from <strong>${escapeHtml(companyName)}</strong> has responded to a review
          for the <strong>${escapeHtml(roleTitle)}</strong> role.
        </p>
        <p style="margin: 24px 0;">
          <a href="${siteUrl}/admin"
             style="background: #111; color: #fff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-size: 14px;">
            Review in Admin
          </a>
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #999; font-size: 13px;">
          HiringLens Notifications
        </p>
      </div>
    `,
  };
}

export function newReviewWatcherEmail(
  companyName: string,
  companySlug: string,
  unsubscribeToken: string
) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hiringlens.com";
  const companyUrl = `${siteUrl}/company/${companySlug}`;
  const unsubscribeUrl = `${siteUrl}/unsubscribe?token=${unsubscribeToken}`;
  return {
    subject: `New interview review posted for ${companyName}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #111; margin-bottom: 16px;">New review at ${escapeHtml(companyName)}</h2>
        <p style="color: #555; line-height: 1.6;">
          A new interview experience has just been published for
          <strong>${escapeHtml(companyName)}</strong> on HiringLens.
        </p>
        <p style="margin: 24px 0;">
          <a href="${companyUrl}"
             style="background: #111; color: #fff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-size: 14px;">
            Read the review
          </a>
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #999; font-size: 12px;">
          You're receiving this because you signed up for alerts about ${escapeHtml(companyName)}.
          <a href="${unsubscribeUrl}" style="color: #999;">Unsubscribe</a>
        </p>
      </div>
    `,
  };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
