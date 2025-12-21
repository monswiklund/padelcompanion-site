// Header scroll effect
const header = document.getElementById("header");

if (header) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
}

// Mobile nav toggle
const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("nav");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("active");
    nav.classList.toggle("open");
  });

  // Close menu when clicking a link
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.classList.remove("active");
      nav.classList.remove("open");
    });
  });
}

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

// ===== Stats Counter Animation (Disabled) =====
/*
const statsObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = +counter.getAttribute("data-target");
        const decimal = +counter.getAttribute("data-decimal") || 0;
        const duration = 2000; // ms
        const increment = target / (duration / 16); // 60fps

        let current = 0;
        const updateCounter = () => {
          current += increment;
          if (current < target) {
            counter.textContent =
              current.toFixed(decimal) + (target > 1000 ? "+" : "");
            // Format K for large numbers if needed or keep simple
            if (target >= 1000) {
              // specific formatting for 10K, 5K
              if (target === 10000) counter.innerText = "10K+";
              else if (target === 5000) counter.innerText = "5K+";
              else counter.innerText = Math.ceil(current);
            } else {
              counter.innerText = current.toFixed(decimal);
            }

            // Simple lerp for smoother finish? No, simple increment is fine.
            // Let's stick to the original static values for K representation during animation
            // Actually, let's make it count properly
            if (target >= 1000) {
              counter.innerText = Math.floor(current / 1000) + "K+";
            } else {
              counter.innerText = current.toFixed(decimal);
            }

            requestAnimationFrame(updateCounter);
          } else {
            // Final value
            if (target === 10000) counter.innerText = "10K+";
            else if (target === 5000) counter.innerText = "5K+";
            else if (target === 15) counter.innerText = "15+";
            else counter.innerText = target.toFixed(decimal);
          }
        };

        updateCounter();
        observer.unobserve(counter);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll(".counter").forEach((counter) => {
  statsObserver.observe(counter);
});
*/

// ===== Theme Toggle =====
const themeToggle = document.getElementById("themeToggle");

function initTheme() {
  const saved = localStorage.getItem("padelcompanion-theme");
  // Default to dark if no preference or explicitly dark
  const isDark = !saved || saved === "dark";
  document.documentElement.setAttribute(
    "data-theme",
    isDark ? "dark" : "light"
  );

  if (themeToggle) {
    updateThemeIcon(isDark ? "dark" : "light");
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("padelcompanion-theme", next);
  updateThemeIcon(next);
}

function updateThemeIcon(theme) {
  if (!themeToggle) return;
  const icon = themeToggle.querySelector(".theme-icon");
  if (icon) {
    icon.textContent = theme === "dark" ? "🌙" : "☀️";
  }
}

// Init theme on load
document.addEventListener("DOMContentLoaded", initTheme);

// Attach listener
if (themeToggle) {
  themeToggle.addEventListener("click", toggleTheme);
}

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
