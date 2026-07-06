import type { Metadata } from "next";

import { LegalPage, LegalSection } from "@/components/layout/legal-page";
import { SITE_URL } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How VyomaStack handles your data. Browser-local tools, optional AI features, and analytics.",
  alternates: { canonical: `${SITE_URL}/privacy` },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="July 6, 2026">
      <LegalSection title="Overview">
        <p>
          VyomaStack (&quot;we&quot;, &quot;us&quot;) operates{" "}
          <a
            href={SITE_URL}
            className="text-primary underline-offset-4 hover:underline"
          >
            vyomastack.com
          </a>
          , an AI workspace with free developer tools. This policy explains what
          data we collect and how we use it.
        </p>
      </LegalSection>

      <LegalSection title="Browser-local tools (no upload)">
        <p>
          Many tools — including SQL formatting, JSON formatting, JWT decoding,
          Base64/URL encoding, password generation, hash generation, QR codes,
          regex testing, and cron building — run{" "}
          <strong className="text-foreground">entirely in your browser</strong>.
          For those tools, your input is not sent to our servers.
        </p>
      </LegalSection>

      <LegalSection title="AI-powered features">
        <p>
          When you use AI features (SQL explain, JSON studio, Spark error
          explainer, Spark tuning advisor), the text you submit is sent to our
          servers to generate a response. We may forward requests to third-party
          AI providers (e.g. Google Gemini) to produce explanations.
        </p>
        <p>
          <strong className="text-foreground">Do not submit</strong> production
          passwords, API keys, personal data, or highly sensitive SQL/logs
          unless you accept that risk. Redact secrets before pasting.
        </p>
        <p>
          We cache identical AI requests for up to one hour to reduce load and
          improve reliability. Cached responses are stored temporarily in server
          memory.
        </p>
      </LegalSection>

      <LegalSection title="Analytics">
        <p>
          If enabled, we use privacy-friendly analytics (such as Google Analytics
          or Microsoft Clarity) to understand traffic and improve the product.
          These services may use cookies or similar technologies. You can block
          cookies in your browser settings.
        </p>
      </LegalSection>

      <LegalSection title="Logs and hosting">
        <p>
          Our hosting provider (Vercel) may process standard server logs — IP
          address, browser type, pages visited, and timestamps — for security
          and operations. We do not sell personal information.
        </p>
      </LegalSection>

      <LegalSection title="Cookies">
        <p>
          We do not require login. Essential cookies may be set by analytics
          providers if configured. Most formatter tools do not use cookies for
          core functionality.
        </p>
      </LegalSection>

      <LegalSection title="Children">
        <p>
          VyomaStack is intended for software professionals. We do not knowingly
          collect data from children under 13.
        </p>
      </LegalSection>

      <LegalSection title="Your choices">
        <ul className="list-disc space-y-1 pl-5">
          <li>Use browser-only tools without sending data to our AI APIs.</li>
          <li>Disable cookies or use browser privacy modes.</li>
          <li>Do not use AI features for confidential production data.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Changes">
        <p>
          We may update this policy. The &quot;Last updated&quot; date at the top
          will change when we do. Continued use of the site means you accept the
          updated policy.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions about privacy? Email{" "}
          <a
            href="mailto:privacy@vyomastack.com"
            className="text-primary underline-offset-4 hover:underline"
          >
            privacy@vyomastack.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
