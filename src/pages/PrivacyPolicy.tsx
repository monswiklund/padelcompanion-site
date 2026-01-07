import React, { useEffect } from "react";

const PrivacyPolicy: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="py-24 min-h-screen">
      <div className="max-w-3xl mx-auto px-6">
        <article className="prose prose-invert">
          <h1 className="text-4xl font-bold text-primary mb-2">
            Privacy Policy
          </h1>
          <p className="text-secondary mb-8">Last updated: November 27, 2025</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">
              Introduction
            </h2>
            <p className="text-secondary leading-relaxed">
              Padel Companion ("we," "our," or "us") is committed to protecting
              your privacy. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you use our mobile
              application (the "App").
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">
              Information We Collect
            </h2>
            <h3 className="text-xl font-medium text-primary mb-3">
              Personal Data
            </h3>
            <p className="text-secondary leading-relaxed mb-4">
              We may collect personally identifiable information that you
              voluntarily provide to us when you register with the App, such as:
            </p>
            <ul className="list-disc list-inside text-secondary space-y-2 mb-6">
              <li>Name / Display Name</li>
              <li>Email address</li>
              <li>Profile information</li>
            </ul>

            <h3 className="text-xl font-medium text-primary mb-3">
              Usage Data
            </h3>
            <p className="text-secondary leading-relaxed mb-4">
              We automatically collect certain information when you access the
              App, including:
            </p>
            <ul className="list-disc list-inside text-secondary space-y-2">
              <li>Device type and operating system</li>
              <li>
                App usage statistics (e.g., match scores, game modes played)
              </li>
              <li>Crash reports and performance data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">
              How We Use Your Information
            </h2>
            <p className="text-secondary leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-secondary space-y-2">
              <li>Create and manage your account</li>
              <li>
                Provide and improve the App's functionality (e.g., syncing
                scores across devices)
              </li>
              <li>Process in-app purchases and subscriptions</li>
              <li>Respond to your support requests</li>
              <li>
                Monitor and analyze usage and trends to improve user experience
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">
              Third-Party Services
            </h2>
            <p className="text-secondary leading-relaxed mb-4">
              We use the following third-party services which may collect
              information used to identify you:
            </p>
            <ul className="list-disc list-inside text-secondary space-y-2">
              <li>
                <strong className="text-primary">Google Firebase:</strong> For
                authentication, database (Firestore), cloud functions, and
                analytics.
              </li>
              <li>
                <strong className="text-primary">RevenueCat:</strong> For
                managing in-app subscriptions and purchases.
              </li>
              <li>
                <strong className="text-primary">Simple Analytics:</strong> For
                privacy-friendly website analytics. Simple Analytics does not
                use cookies, does not collect personal information, and does not
                track users.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">
              Data Retention
            </h2>
            <p className="text-secondary leading-relaxed">
              We retain your personal information only for as long as is
              necessary for the purposes set out in this Privacy Policy. You can
              request deletion of your account and data at any time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">
              Your Rights
            </h2>
            <p className="text-secondary leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-secondary space-y-2">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and all associated data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">
              Changes to This Privacy Policy
            </h2>
            <p className="text-secondary leading-relaxed">
              We may update our Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">
              Contact Us
            </h2>
            <p className="text-secondary leading-relaxed mb-2">
              If you have any questions about this Privacy Policy, please
              contact us at:
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

export default PrivacyPolicy;
