import React, { useEffect } from "react";

const PrivacyPolicy: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="legal-page" style={{ padding: "var(--space-2xl) 0" }}>
      <div className="container">
        <article className="legal-content">
          <h1>Privacy Policy</h1>
          <p className="last-updated">Last updated: November 27, 2025</p>

          <section>
            <h2>Introduction</h2>
            <p>
              Padel Companion ("we," "our," or "us") is committed to protecting
              your privacy. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you use our mobile
              application (the "App").
            </p>
          </section>

          <section>
            <h2>Information We Collect</h2>
            <h3>Personal Data</h3>
            <p>
              We may collect personally identifiable information that you
              voluntarily provide to us when you register with the App, such as:
            </p>
            <ul>
              <li>Name / Display Name</li>
              <li>Email address</li>
              <li>Profile information</li>
            </ul>

            <h3>Usage Data</h3>
            <p>
              We automatically collect certain information when you access the
              App, including:
            </p>
            <ul>
              <li>Device type and operating system</li>
              <li>
                App usage statistics (e.g., match scores, game modes played)
              </li>
              <li>Crash reports and performance data</li>
            </ul>
          </section>

          <section>
            <h2>How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
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

          <section>
            <h2>Third-Party Services</h2>
            <p>
              We use the following third-party services which may collect
              information used to identify you:
            </p>
            <ul>
              <li>
                <strong>Google Firebase:</strong> For authentication, database
                (Firestore), cloud functions, and analytics.
              </li>
              <li>
                <strong>RevenueCat:</strong> For managing in-app subscriptions
                and purchases.
              </li>
              <li>
                <strong>Simple Analytics:</strong> For privacy-friendly website
                analytics. Simple Analytics does not use cookies, does not
                collect personal information, and does not track users.
              </li>
            </ul>
          </section>

          <section>
            <h2>Data Retention</h2>
            <p>
              We retain your personal information only for as long as is
              necessary for the purposes set out in this Privacy Policy. You can
              request deletion of your account and data at any time.
            </p>
          </section>

          <section>
            <h2>Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and all associated data</li>
            </ul>
          </section>

          <section>
            <h2>Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on this page.
            </p>
          </section>

          <section>
            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please
              contact us at:
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

export default PrivacyPolicy;
