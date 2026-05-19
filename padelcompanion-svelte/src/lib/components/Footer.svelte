<script lang="ts">
  const year = new Date().getFullYear();
</script>

<footer class="bg-muted border-t border-border pt-16 pb-8 mt-auto">
  <div class="container max-w-[1200px] mx-auto px-6">
    <div class="flex flex-col items-center text-center gap-12 mb-12">
      <div class="max-w-[500px] mx-auto">
        <a
          href="/"
          class="flex items-center justify-center gap-2 font-display text-xl font-bold text-foreground mb-4"
        >
          <img
            src="/assets/app-icon.jpeg"
            alt="Padel Companion Logo"
            class="w-10 h-10 rounded-xl"
          />
          <span>Padel Companion</span>
        </a>
        <p class="text-muted-foreground">
          Your digital padel companion. Track scores, view statistics, and
          organize tournaments with ease.
        </p>
      </div>

      <div class="flex justify-center flex-wrap gap-12 md:gap-24">
        <div class="text-left">
          <h5 class="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6">
            Legal
          </h5>
          <ul class="flex flex-col gap-2 list-none p-0 m-0">
            <li>
              <a
                href="/privacy"
                class="text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="/terms"
                class="text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Service
              </a>
            </li>
          </ul>
        </div>

        <div class="text-left">
          <h5 class="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6">
            Support
          </h5>
          <ul class="flex flex-col gap-2 list-none p-0 m-0">
            <li>
              <a
                href="/support"
                class="text-muted-foreground hover:text-foreground transition-colors"
              >
                Help & FAQ
              </a>
            </li>
            <li>
              <a
                href="/support"
                class="text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact Us
              </a>
            </li>
            <li>
              <a
                href="/support"
                class="text-muted-foreground hover:text-foreground transition-colors"
              >
                Delete my account
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-4">
        <h5 class="text-muted-foreground text-sm uppercase tracking-wider font-semibold mb-6">
          Donate
        </h5>
        <a
          href="https://buymeacoffee.com/wiklundlabs"
          target="_blank"
          rel="noopener"
          class="inline-block transition-transform hover:-translate-y-0.5"
        >
          <img
            src="/assets/buymeacoffee.png"
            alt="Buy Me A Coffee"
            loading="lazy"
            width={145}
            height={40}
            style="height: 40px; width: 145px;"
          />
        </a>
      </div>
    </div>

    <div class="pt-8 border-t border-border text-center text-muted-foreground text-sm">
      <p>&copy; {year} Padel Companion. All rights reserved.</p>
    </div>
  </div>
</footer>
