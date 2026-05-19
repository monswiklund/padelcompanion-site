<script lang="ts">
  import { onMount } from "svelte";

  onMount(() => {
    window.scrollTo(0, 0);
  });
</script>

<main class="py-24 min-h-screen">
  <div class="max-w-3xl mx-auto px-6">
    <article class="prose prose-invert animate-fade-in-up">
      <h1 class="text-4xl md:text-5xl font-black text-foreground mb-2 font-display">
        Privacy Policy
      </h1>
      <p class="text-muted-foreground mb-12">Last updated: November 27, 2025</p>

      <section class="mb-10">
        <h2 class="text-2xl font-bold text-foreground mb-4 font-display">
          Introduction
        </h2>
        <p class="text-muted-foreground leading-relaxed">
          Padel Companion ("we," "our," or "us") is committed to protecting
          your privacy. This Privacy Policy explains how we collect, use,
          disclose, and safeguard your information when you use our mobile
          application (the "App").
        </p>
      </section>

      <section class="mb-10">
        <h2 class="text-2xl font-bold text-foreground mb-4 font-display">
          Information We Collect
        </h2>
        <h3 class="text-xl font-semibold text-foreground mb-3 font-display">
          Personal Data
        </h3>
        <p class="text-muted-foreground leading-relaxed mb-4">
          We may collect personally identifiable information that you
          voluntarily provide to us when you register with the App, such as:
        </p>
        <ul class="list-disc list-inside text-muted-foreground space-y-2 mb-6 pl-4">
          <li>Name / Display Name</li>
          <li>Email address</li>
          <li>Profile information</li>
        </ul>

        <h3 class="text-xl font-semibold text-foreground mb-3 font-display">
          Usage Data
        </h3>
        <p class="text-muted-foreground leading-relaxed mb-4">
          We automatically collect certain information when you access the
          App, including:
        </p>
        <ul class="list-disc list-inside text-muted-foreground space-y-2 pl-4">
          <li>Device type and operating system</li>
          <li>
            App usage statistics (e.g., match scores, game modes played)
          </li>
          <li>Crash reports and performance data</li>
        </ul>
      </section>

      <section class="mb-10">
        <h2 class="text-2xl font-bold text-foreground mb-4 font-display">
          How We Use Your Information
        </h2>
        <p class="text-muted-foreground leading-relaxed mb-4">
          We use the information we collect to:
        </p>
        <ul class="list-disc list-inside text-muted-foreground space-y-2 pl-4">
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

      <section class="mb-10">
        <h2 class="text-2xl font-bold text-foreground mb-4 font-display">
          Third-Party Services
        </h2>
        <p class="text-muted-foreground leading-relaxed mb-4">
          We use the following third-party services which may collect
          information used to identify you:
        </p>
        <ul class="list-disc list-inside text-muted-foreground space-y-3 pl-4">
          <li>
            <strong class="text-foreground font-display">Google Firebase:</strong> For
            authentication, database (Firestore), cloud functions, and
            analytics.
          </li>
          <li>
            <strong class="text-foreground font-display">RevenueCat:</strong> For
            managing in-app subscriptions and purchases.
          </li>
          <li>
            <strong class="text-foreground font-display">Simple Analytics:</strong> For
            privacy-friendly website analytics. Simple Analytics does not
            use cookies, does not collect personal information, and does not
            track users.
          </li>
        </ul>
      </section>

      <section class="mb-10">
        <h2 class="text-2xl font-bold text-foreground mb-4 font-display">
          Data Retention
        </h2>
        <p class="text-muted-foreground leading-relaxed">
          We retain your personal information only for as long as is
          necessary for the purposes set out in this Privacy Policy. You can
          request deletion of your account and data at any time.
        </p>
      </section>

      <section class="mb-10">
        <h2 class="text-2xl font-bold text-foreground mb-4 font-display">
          Your Rights
        </h2>
        <p class="text-muted-foreground leading-relaxed mb-4">
          You have the right to:
        </p>
        <ul class="list-disc list-inside text-muted-foreground space-y-2 pl-4">
          <li>Access the personal data we hold about you</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your account and all associated data</li>
        </ul>
      </section>

      <section class="mb-10">
        <h2 class="text-2xl font-bold text-foreground mb-4 font-display">
          Changes to This Privacy Policy
        </h2>
        <p class="text-muted-foreground leading-relaxed">
          We may update our Privacy Policy from time to time. We will notify
          you of any changes by posting the new Privacy Policy on this page.
        </p>
      </section>

      <section class="mb-10">
        <h2 class="text-2xl font-bold text-foreground mb-4 font-display">
          Contact Us
        </h2>
        <p class="text-muted-foreground leading-relaxed mb-4">
          If you have any questions about this Privacy Policy, please
          contact us at:
        </p>
        <p>
          <a
            href="mailto:wiklund.labs@gmail.com"
            class="text-accent hover:text-accent-light transition-colors font-semibold"
          >
            wiklund.labs@gmail.com
          </a>
        </p>
      </section>
    </article>
  </div>
</main>
