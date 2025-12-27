import { injectLayout } from "../shared/layout.js";
import { loadState } from "./state.js";
import { initHistory } from "./history.js";
import { initTheme } from "../shared/theme.js";
import { registerRoute, initRouter, getCurrentRoute } from "./router.js";
import { showToast } from "../shared/utils.js";
import {
  updateSetupUI,
  updateScoringLabel,
  toggleCustomCourtNames,
  setRenderTournamentConfigCallback,
  renderTournamentConfig,
  handleResize,
  setupCustomSelects,
} from "./ui/index.js";
import { initPWA } from "../shared/pwa.js";
import { showInfoModal } from "./modals.js";

// Page modules for routing
import { generatorPage } from "./pages/generator.js";
import { bracketPage } from "./pages/bracket/index.js";
import { winnersCourtPage } from "./pages/winnersCourt/index.js";

// ===== Initialize Application =====
function init() {
  try {
    console.log("Tournament App: Initialized");
    injectLayout({ activeLink: "tournament" });

    // Initialize PWA
    initPWA("installBtn", () => {
      showInfoModal(
        "Install App on iPhone",
        `
        <div style="text-align: center;">
          <p style="margin-bottom: 20px;">To install <strong>Tournament - Padel Companion</strong> as an app on your Home Screen:</p>
          <ol style="text-align: left; padding-left: 20px; line-height: 1.6;">
            <li style="margin-bottom: 12px;">Tap the <strong>Share</strong> button <span style="font-size: 1.2em">⎋</span> (square with arrow) at the bottom in Safari.</li>
            <li style="margin-bottom: 12px;">Scroll down and tap <strong>Add to Home Screen</strong> <span style="font-size: 1.2em">⊞</span>.</li>
            <li>Tap <strong>Add</strong> in the top right corner.</li>
          </ol>
        </div>
        `
      );
    });

    // Initialize theme
    initTheme();

    // Load saved state
    loadState();

    // Toggle custom court names based on state
    toggleCustomCourtNames();

    // Set callback to avoid circular dependency
    setRenderTournamentConfigCallback(renderTournamentConfig);

    // Initialize History
    initHistory();

    // Setup resize handler
    window.addEventListener("resize", handleResize);

    // Setup scroll-to-top button
    initScrollToTop();

    // Initial UI Sync
    updateSetupUI();
    updateScoringLabel();
    renderTournamentConfig();

    // Initialize ripple effect on buttons
    initRippleEffect();

    // Initialize scroll animations
    initScrollAnimations();

    // ===== Router Setup =====
    // Register page routes
    registerRoute("", generatorPage); // Default
    registerRoute("generator", generatorPage); // Explicit generator
    registerRoute("bracket", bracketPage); // Bracket view
    registerRoute("winners-court", winnersCourtPage); // Finals/podium

    // Add page navigation tabs
    injectPageNavigation();

    // Initialize router (will mount appropriate page based on hash)
    initRouter();
    console.log(
      "[Tournament] Router initialized. Current route:",
      getCurrentRoute()
    );
  } catch (e) {
    console.error("CRITICAL ERROR IN INIT:", e);
    showToast("Application failed to start: " + e.message, "error");
  }
}

// ===== Ripple Effect =====
function initRippleEffect() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn");
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.width = ripple.style.height = `${Math.max(
      rect.width,
      rect.height
    )}px`;
    ripple.style.left = `${e.clientX - rect.left - ripple.offsetWidth / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - ripple.offsetHeight / 2}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
}

// ===== Page Navigation Tabs =====
function injectPageNavigation() {
  const container = document.querySelector(".tournament-page .container");
  const toolHeader = container?.querySelector(".tool-header");

  if (!toolHeader) {
    console.error(
      "[Router] Could not find .tool-header to inject navigation. Check HTML structure."
    );
    if (!container)
      console.error("[Router] .tournament-page .container not found either.");
    return;
  }

  // Create navigation tabs
  const nav = document.createElement("nav");
  nav.className = "page-nav";
  nav.innerHTML = `
    <div class="page-nav-tabs">
      <a href="#/generator" class="page-nav-tab" data-route="generator">
        <span class="tab-label">Generator</span>
      </a>
      <a href="#/bracket" class="page-nav-tab" data-route="bracket">
        <span class="tab-label">Bracket</span>
      </a>
      <a href="#/winners-court" class="page-nav-tab" data-route="winners-court">
        <span class="tab-label">Winners Court</span>
      </a>
    </div>
  `;

  // Insert after header
  toolHeader.after(nav);

  // Add page container for routed content (bracket/winners pages)
  // Generator uses existing HTML, other pages render into this
  let pageContainer = document.getElementById("pageContainer");
  if (!pageContainer) {
    pageContainer = document.createElement("div");
    pageContainer.id = "pageContainer";
    pageContainer.className = "page-container";
    pageContainer.style.display = "none"; // Hidden by default, shown for non-generator pages

    // Insert after navigation
    nav.after(pageContainer);
  }

  // Update active tab on route change
  function updateActiveTab() {
    const { route } = getCurrentRoute();
    const currentRoute = route || "generator";

    nav.querySelectorAll(".page-nav-tab").forEach((tab) => {
      if (tab.dataset.route === currentRoute) {
        tab.classList.add("active");
      } else {
        tab.classList.remove("active");
      }
    });

    // Update page title and subtitle based on route
    const titleEl = document.getElementById("toolTitle");
    const subtitleEl = document.getElementById("toolSubtitle");
    if (titleEl && subtitleEl) {
      const titles = {
        generator: {
          title: "Americano & Mexicano Generator",
          subtitle:
            "Create Americano and Mexicano schedules for your padel group in seconds.",
        },
        bracket: {
          title: "Bracket Generator",
          subtitle: "Create single or dual elimination tournament brackets.",
        },
        "winners-court": {
          title: "Winners Court",
          subtitle: "Skill-based court placement for balanced matches.",
        },
      };
      const config = titles[currentRoute] || titles.generator;
      titleEl.textContent = config.title;
      subtitleEl.textContent = config.subtitle;
    }

    // Toggle visibility:
    // All pages render into pageContainer now.
    if (pageContainer.style.display === "none") {
      pageContainer.style.display = "block";
    }
  }

  // Initial update
  updateActiveTab();

  // Listen for route changes
  window.addEventListener("hashchange", updateActiveTab);
}

// ===== Scroll Animations =====
function initScrollAnimations() {
  const targets = document.querySelectorAll(
    ".section-title, .leaderboard-header h3, .players-header h3"
  );

  // Immediately animate elements visible on load
  targets.forEach((el) => el.classList.add("animate-in"));

  // Also watch for new elements coming into view
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      });
    },
    { threshold: 0.1 }
  );

  targets.forEach((el) => observer.observe(el));
}

// ===== Scroll to Top =====
function initScrollToTop() {
  const btn = document.getElementById("scrollTopBtn");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      btn.classList.add("visible");
    } else {
      btn.classList.remove("visible");
    }
  });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ===== Start Application =====
init();
