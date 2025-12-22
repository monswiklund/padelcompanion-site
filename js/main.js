import { injectLayout } from "../src/shared/layout.js";
import {
  initTheme,
  toggleTheme,
  updateThemeIcon,
} from "../src/shared/theme.js";

// Determine active page
const path = window.location.pathname;
let activeLink = "";
if (path === "/" || path === "/index.html") activeLink = "home";
else if (path.includes("support")) activeLink = "support";
else if (path.includes("tournament")) activeLink = "tournament";

// Inject Layout (Header, Footer, Partners)
injectLayout({ activeLink });

// Mobile nav and header interactions are handled by injectLayout internally now.

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, observerOptions);

// Observe all cards for animation
document.querySelectorAll(".card").forEach((card) => {
  observer.observe(card);
});

// ===== Theme Logic is now largely handled by layout.js, but we keep init for non-layout elements if any =====
// The layout.js initializes the theme toggle listener.

// ===== Mockup Interaction =====
window.switchMockupTab = (tab) => {
  // Update Nav
  document.querySelectorAll(".nav-item").forEach((el) => {
    el.classList.remove("active");
  });
  const navItem = document.getElementById(`nav-${tab}`);
  if (navItem) navItem.classList.add("active");

  // Update Content
  document.querySelectorAll(".mockup-content").forEach((el) => {
    el.style.display = "none";
  });
  const content = document.getElementById(`mockup-${tab}`);
  if (content) content.style.display = "flex";
};

// ===== Watch Live Scoring (Click-based) =====
(function initWatchAnimation() {
  const POINTS = ["0", "15", "30", "40"];
  let orangeIdx = 0;
  let blueIdx = 0;

  const orangeScore = document.getElementById("watch-score-orange");
  const blueScore = document.getElementById("watch-score-blue");

  if (!orangeScore || !blueScore) return;

  // Initialize scores
  orangeScore.textContent = "0";
  blueScore.textContent = "0";

  // Track game winners for dot colors
  let gameWinners = []; // Array of 'orange' or 'blue'

  // Update dot indicators with team colors
  function updateDots() {
    for (let i = 0; i < 5; i++) {
      const dot = document.getElementById(`dot-${i}`);
      if (dot) {
        dot.classList.remove("orange", "blue");
        if (gameWinners[i]) {
          dot.classList.add(gameWinners[i]);
        }
      }
    }
  }

  // Expose click-based scoring
  window.watchScore = (team) => {
    if (team === "orange") {
      orangeIdx++;
      if (orangeIdx >= POINTS.length) {
        orangeIdx = 0;
        blueIdx = 0;
        gameWinners.push("orange");
        if (gameWinners.length > 5) {
          gameWinners = ["orange"]; // Reset with current win
        }
        updateDots();
      }
    } else {
      blueIdx++;
      if (blueIdx >= POINTS.length) {
        orangeIdx = 0;
        blueIdx = 0;
        gameWinners.push("blue");
        if (gameWinners.length > 5) {
          gameWinners = ["blue"];
        }
        updateDots();
      }
    }
    orangeScore.textContent = POINTS[orangeIdx];
    blueScore.textContent = POINTS[blueIdx];
  };
})();
