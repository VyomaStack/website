import type { Metadata } from "next";

import { LegalPage, LegalSection } from "@/components/layout/legal-page";
import { SITE_URL } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of use for VyomaStack free developer tools and AI workspace.",
  alternates: { canonical: `${SITE_URL}/terms` },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="July 6, 2026">
      <LegalSection title="Agreement">
        <p>
          By using VyomaStack at{" "}
          <a
            href={SITE_URL}
            className="text-primary underline-offset-4 hover:underline"
          >
            vyomastack.com
          </a>
          , you agree to these Terms of Service. If you do not agree, please do
          not use the site.
        </p>
      </LegalSection>

      <LegalSection title="Service description">
        <p>
          VyomaStack provides free online developer tools and optional AI-assisted
          features for software engineers. Tools and AI outputs are provided for
          informational and productivity purposes only — not professional,
          legal, or security advice.
        </p>
      </LegalSection>

      <LegalSection title="Free service">
        <p>
          Core tools are free and do not require an account. We may introduce paid
          features in the future; free tiers will remain available unless stated
          otherwise.
        </p>
      </LegalSection>

      <LegalSection title="Acceptable use">
        <p>You agree not to:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Abuse, overload, or automate requests to harm the service.</li>
          <li>Use the site for illegal activity or to process unlawful content.</li>
          <li>Attempt to bypass rate limits or access systems without authorization.</li>
          <li>Scrape or resell the service in a way that competes unfairly without permission.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Your content and responsibility">
        <p>
          You are responsible for text, SQL, logs, JSON, and other data you paste
          into our tools. Do not submit confidential, regulated, or personal data
          you are not allowed to share. AI responses may be inaccurate — always
          verify before use in production.
        </p>
      </LegalSection>

      <LegalSection title="AI disclaimers">
        <p>
          AI-generated explanations, code, and recommendations may contain errors.
          VyomaStack does not guarantee correctness of AI output. Use your own
          judgment and testing before deploying changes to production systems.
        </p>
      </LegalSection>

      <LegalSection title="Intellectual property">
        <p>
          The VyomaStack name, branding, site design, and original content are
          owned by VyomaStack. Open-source components used in the project are
          Open-source components used in the project are subject to their
          respective licenses.
        </p>
      </LegalSection>

      <LegalSection title="Disclaimer of warranties">
        <p>
          THE SERVICE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND,
          EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR
          PURPOSE, AND NON-INFRINGEMENT.
        </p>
      </LegalSection>

      <LegalSection title="Limitation of liability">
        <p>
          To the fullest extent permitted by law, VyomaStack shall not be liable
          for any indirect, incidental, special, or consequential damages arising
          from your use of the tools or AI features, including data loss, downtime,
          or incorrect query/code generation.
        </p>
      </LegalSection>

      <LegalSection title="Third-party services">
        <p>
          We rely on third-party hosting and AI providers. Their terms and privacy
          policies also apply to portions of the service they operate.
        </p>
      </LegalSection>

      <LegalSection title="Changes and termination">
        <p>
          We may modify, suspend, or discontinue any part of the service at any
          time. We may update these terms; continued use after changes constitutes
          acceptance.
        </p>
      </LegalSection>

      <LegalSection title="Governing law">
        <p>
          These terms are governed by applicable law in the jurisdiction where
          VyomaStack operates, without regard to conflict-of-law principles.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions about these terms? Email{" "}
          <a
            href="mailto:legal@vyomastack.com"
            className="text-primary underline-offset-4 hover:underline"
          >
            legal@vyomastack.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
