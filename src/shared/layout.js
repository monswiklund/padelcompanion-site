import { initTheme, toggleTheme, updateThemeIcon } from "./theme.js";

/**
 * Shared Layout Components
 * Injects consistent Header and Footer across all pages
 */

export function injectLayout(activeParams = {}) {
  injectHeader(activeParams.activeLink);
  injectFooter();
  injectPartners();
}

function injectHeader(activeLink = "") {
  // Check if header slot exists, if not, try to insert at top of body
  let headerSlot = document.getElementById("header-slot");
  if (!headerSlot) {
    headerSlot = document.createElement("div");
    headerSlot.id = "header-slot";
    document.body.insertBefore(headerSlot, document.body.firstChild);
  }

  const isHome = activeLink === "home";
  const isFeatures = activeLink === "features";
  const isTournament = activeLink === "tournament";
  const isSupport = activeLink === "support";

  headerSlot.innerHTML = `
    <header class="header scrolled">
      <div class="container header-inner">
        <a href="/" class="logo">
          <img src="/assets/app-icon.jpeg" alt="Padel Companion Logo" />
          <span>Padel Companion</span>
        </a>
        <div class="header-actions">
          <nav class="nav" id="nav">
            <a href="/" class="${isHome ? "active" : ""}">Home</a>
            <a href="/#features" class="${
              isFeatures ? "active" : ""
            }">Features</a>
            <div class="nav-dropdown">
              <a href="/tournament/" class="nav-dropdown-trigger ${
                isTournament ? "active" : ""
              }">
                Tournament
                <span class="dropdown-arrow">▾</span>
              </a>
              <div class="nav-dropdown-menu">
                <a href="/tournament/#/generator" class="nav-dropdown-item">
                  Generator
                </a>
                <a href="/tournament/#/bracket" class="nav-dropdown-item">
                  Bracket
                </a>
                <a href="/tournament/#/winners-court" class="nav-dropdown-item">
                  Winners
                </a>
              </div>
            </div>
            <a href="/support.html" class="${
              isSupport ? "active" : ""
            }">Support</a>
          </nav>
          <button class="theme-toggle" id="themeToggle" title="Toggle theme">
            <span class="theme-icon">🌙</span>
          </button>
          <button class="nav-toggle" id="navToggle" aria-label="Toggle menu">
            <span class="hamburger"></span>
          </button>
        </div>
      </div>
    </header>
  `;

  // Initialize header interactions (mobile menu, theme toggle)
  initHeaderInteractions();
}

function injectFooter() {
  let footerSlot = document.getElementById("footer-slot");
  if (!footerSlot) {
    // If no slot, append before scripts at bottom
    footerSlot = document.createElement("div");
    footerSlot.id = "footer-slot";

    // Find where to insert (before scripts)
    const scripts = document.querySelectorAll("script");
    if (scripts.length > 0) {
      document.body.insertBefore(footerSlot, scripts[0]);
    } else {
      document.body.appendChild(footerSlot);
    }
  }

  const year = new Date().getFullYear();

  footerSlot.innerHTML = `
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-brand">
            <a href="/" class="logo">
              <img src="/assets/app-icon.jpeg" alt="Padel Companion Logo" />
              <span>Padel Companion</span>
            </a>
            <p>
              Your digital padel companion. Track scores, view statistics, and
              organize tournaments with ease.
            </p>
          </div>

          <div class="footer-links-row">
            <div class="footer-links">
              <h5>Legal</h5>
              <ul>
                <li><a href="/privacy.html">Privacy Policy</a></li>
                <li><a href="/terms.html">Terms of Service</a></li>
              </ul>
            </div>

            <div class="footer-links">
              <h5>Support</h5>
              <ul>
                <li><a href="/support.html">Help & FAQ</a></li>
                <li><a href="/contact.html">Contact Us</a></li>
                <li><a href="/delete-account.html">Delete my account</a></li>
              </ul>
            </div>
          </div>

          <div class="footer-donate">
            <h5
              style="
                color: var(--text-muted);
                font-size: 0.875rem;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                font-weight: 600;
                margin-bottom: var(--space-lg);
              "
            >
              Donate
            </h5>
            <a
              href="https://buymeacoffee.com/wiklundlabs"
              target="_blank"
              rel="noopener"
              class="footer-donate-btn"
            >
              <img
                src="/assets/buymeacoffee.png"
                alt="Buy Me A Coffee"
                loading="lazy"
                style="height: 40px !important; width: 145px !important"
              />
            </a>
          </div>
        </div>

        <div class="footer-bottom">
          <p>&copy; ${year} Padel Companion. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `;
}

function injectPartners() {
  // Only inject if partner-slot exists
  const partnerSlot = document.getElementById("partner-slot");
  if (!partnerSlot) return;

  partnerSlot.innerHTML = `
    <section class="partners section" id="partners">
      <div class="container">
        <div class="partners-grid" style="grid-template-columns: repeat(3, 1fr); gap: var(--space-md);">
          <!-- Sponsor Slot 1 -->
          <a href="mailto:wiklund.labs@gmail.com" class="partner-logo-placeholder" style="height: 100px;">
            <span>Your Logo Here</span>
          </a>
          
          <!-- Sponsor Slot 2 -->
          <a href="mailto:wiklund.labs@gmail.com" class="partner-logo-placeholder" style="height: 100px;">
            <span>Your Logo Here</span>
          </a>
          
          <!-- Sponsor Slot 3 -->
          <a href="mailto:wiklund.labs@gmail.com" class="partner-logo-placeholder" style="height: 100px;">
            <span>Your Logo Here</span>
          </a>
        </div>
      </div>
    </section>
  `;
}

function initHeaderInteractions() {
  // Mobile Nav Toggle
  const navToggle = document.getElementById("navToggle");
  const nav = document.getElementById("nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      nav.classList.toggle("open");
      navToggle.classList.toggle("active");
    });

    // Close on click outside or on link click
    document.addEventListener("click", (e) => {
      if (
        nav.classList.contains("open") &&
        !nav.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
        nav.classList.remove("open");
        navToggle.classList.remove("active");
      }
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        navToggle.classList.remove("active");
      });
    });
  }

  // Theme Toggle
  const themeToggleStart = document.getElementById("themeToggle");
  if (themeToggleStart) {
    // Initialize theme from storage (uses consistent key from theme.js)
    const currentTheme = initTheme();
    updateThemeIcon(themeToggleStart, currentTheme);

    themeToggleStart.addEventListener("click", () => {
      const newTheme = toggleTheme();
      updateThemeIcon(themeToggleStart, newTheme);

      // Dispatch event for other components (like charts)
      window.dispatchEvent(
        new CustomEvent("themeChanged", { detail: { theme: newTheme } })
      );
    });
  }
}
