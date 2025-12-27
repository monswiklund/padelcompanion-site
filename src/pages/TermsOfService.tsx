import React, { useEffect } from "react";

const TermsOfService: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="legal-page" style={{ padding: "var(--space-2xl) 0" }}>
      <div className="container">
        <article className="legal-content">
          <h1>Terms of Service</h1>
          <p className="last-updated">Last updated: November 27, 2025</p>

          <section>
            <h2>1. Agreement to Terms</h2>
            <p>
              By accessing or using Padel Companion, you agree to be bound by
              these Terms of Service. If you disagree with any part of the
              terms, you may not access the service.
            </p>
          </section>

          <section>
            <h2>2. Accounts</h2>
            <p>
              When you create an account with us, you must provide us with
              information that is accurate, complete, and current at all times.
              Failure to do so constitutes a breach of the Terms, which may
              result in immediate termination of your account on our Service.
            </p>
          </section>

          <section>
            <h2>3. Subscriptions</h2>
            <p>
              Some parts of the Service are billed on a subscription basis
              ("Subscription(s)"). You will be billed in advance on a recurring
              and periodic basis (such as monthly or annually). Subscriptions
              are managed via your Apple ID or Google Play account settings.
            </p>
          </section>

          <section>
            <h2>4. Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality
              are and will remain the exclusive property of Padel Companion and
              its licensors.
            </p>
          </section>

          <section>
            <h2>5. Termination</h2>
            <p>
              We may terminate or suspend your account immediately, without
              prior notice or liability, for any reason whatsoever, including
              without limitation if you breach the Terms.
            </p>
          </section>

          <section>
            <h2>6. Limitation of Liability</h2>
            <p>
              In no event shall Padel Companion, nor its directors, employees,
              partners, agents, suppliers, or affiliates, be liable for any
              indirect, incidental, special, consequential or punitive damages,
              including without limitation, loss of profits, data, use,
              goodwill, or other intangible losses, resulting from your access
              to or use of or inability to access or use the Service.
            </p>
          </section>

          <section>
            <h2>7. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the
              laws of Sweden, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2>8. Changes</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace
              these Terms at any time.
            </p>
          </section>

          <section>
            <h2>9. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <p>
              <a href="mailto:wiklund.labs@gmail.com">wiklund.labs@gmail.com</a>
            </p>
          </section>
        </article>
      </div>
    </main>
  );
};

export default TermsOfService;
