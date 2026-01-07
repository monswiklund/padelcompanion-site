import React, { useEffect } from "react";

const TermsOfService: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="py-24 min-h-screen">
      <div className="max-w-3xl mx-auto px-6">
        <article className="prose prose-invert">
          <h1 className="text-4xl font-bold text-primary mb-2">
            Terms of Service
          </h1>
          <p className="text-secondary mb-8">Last updated: November 27, 2025</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">
              1. Agreement to Terms
            </h2>
            <p className="text-secondary leading-relaxed">
              By accessing or using Padel Companion, you agree to be bound by
              these Terms of Service. If you disagree with any part of the
              terms, you may not access the service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">
              2. Accounts
            </h2>
            <p className="text-secondary leading-relaxed">
              When you create an account with us, you must provide us with
              information that is accurate, complete, and current at all times.
              Failure to do so constitutes a breach of the Terms, which may
              result in immediate termination of your account on our Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">
              3. Subscriptions
            </h2>
            <p className="text-secondary leading-relaxed">
              Some parts of the Service are billed on a subscription basis
              ("Subscription(s)"). You will be billed in advance on a recurring
              and periodic basis (such as monthly or annually). Subscriptions
              are managed via your Apple ID or Google Play account settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">
              4. Intellectual Property
            </h2>
            <p className="text-secondary leading-relaxed">
              The Service and its original content, features, and functionality
              are and will remain the exclusive property of Padel Companion and
              its licensors.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">
              5. Termination
            </h2>
            <p className="text-secondary leading-relaxed">
              We may terminate or suspend your account immediately, without
              prior notice or liability, for any reason whatsoever, including
              without limitation if you breach the Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">
              6. Limitation of Liability
            </h2>
            <p className="text-secondary leading-relaxed">
              In no event shall Padel Companion, nor its directors, employees,
              partners, agents, suppliers, or affiliates, be liable for any
              indirect, incidental, special, consequential or punitive damages,
              including without limitation, loss of profits, data, use,
              goodwill, or other intangible losses, resulting from your access
              to or use of or inability to access or use the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">
              7. Governing Law
            </h2>
            <p className="text-secondary leading-relaxed">
              These Terms shall be governed and construed in accordance with the
              laws of Sweden, without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">
              8. Changes
            </h2>
            <p className="text-secondary leading-relaxed">
              We reserve the right, at our sole discretion, to modify or replace
              these Terms at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">
              9. Contact Us
            </h2>
            <p className="text-secondary leading-relaxed mb-2">
              If you have any questions about these Terms, please contact us at:
            </p>
            <p>
              <a
                href="mailto:wiklund.labs@gmail.com"
                className="text-accent hover:text-accent-light transition-colors"
              >
                wiklund.labs@gmail.com
              </a>
            </p>
          </section>
        </article>
      </div>
    </main>
  );
};

export default TermsOfService;
