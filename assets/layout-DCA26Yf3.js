(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const s of n.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&r(s)}).observe(document,{childList:!0,subtree:!0});function a(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerPolicy&&(n.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?n.credentials="include":o.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(o){if(o.ep)return;o.ep=!0;const n=a(o);fetch(o.href,n)}})();const c="padelcompanion-theme";function l(){const e=localStorage.getItem(c),t=!e||e==="dark";return document.documentElement.setAttribute("data-theme",t?"dark":"light"),t?"dark":"light"}function d(){const t=document.documentElement.getAttribute("data-theme")==="dark"?"light":"dark";return document.documentElement.setAttribute("data-theme",t),localStorage.setItem(c,t),t}function i(e,t){if(!e)return;const a=e.querySelector(".theme-icon");a&&(a.textContent=t==="dark"?"🌙":"☀️")}function h(e={}){m(e.activeLink),u(),p()}function m(e=""){let t=document.getElementById("header-slot");t||(t=document.createElement("div"),t.id="header-slot",document.body.insertBefore(t,document.body.firstChild));const a=e==="home",r=e==="features",o=e==="tournament",n=e==="support";t.innerHTML=`
    <header class="header scrolled">
      <div class="container header-inner">
        <a href="/" class="logo">
          <img src="/assets/app-icon.jpeg" alt="Padel Companion Logo" />
          <span>Padel Companion</span>
        </a>
        <div class="header-actions">
          <nav class="nav" id="nav">
            <a href="/" class="${a?"active":""}">Home</a>
            <a href="/#features" class="${r?"active":""}">Features</a>
            <a href="/tournament/" class="${o?"active":""}">Tournament</a>
            <a href="/support.html" class="${n?"active":""}">Support</a>
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
  `,f()}function u(){let e=document.getElementById("footer-slot");if(!e){e=document.createElement("div"),e.id="footer-slot";const a=document.querySelectorAll("script");a.length>0?document.body.insertBefore(e,a[0]):document.body.appendChild(e)}const t=new Date().getFullYear();e.innerHTML=`
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
          <p>&copy; ${t} Padel Companion. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `}function p(){const e=document.getElementById("partner-slot");e&&(e.innerHTML=`
    <section class="partners section" id="partners">
      <div class="container">
        <div class="features-header">
          <h2>Trusted By <span class="text-gradient">Partners</span></h2>
          <p>Collaborating with leading brands to grow the sport of padel.</p>
        </div>

        <div class="partners-grid">
          <!-- Premium/Featured Partner Placeholder -->
          <div class="card partner-card featured">
            <div class="partner-logo-placeholder">
              <span>Your Logo Here</span>
            </div>
            <div class="partner-info">
              <h3>Become a Sponsor</h3>
              <p>Showcase your brand to thousands of padel players.</p>
              <a
                href="mailto:wiklundlabs@gmail.com"
                class="btn btn-primary btn-sm"
                >Contact Us</a
              >
            </div>
          </div>
        </div>
      </div>
    </section>
  `)}function f(){const e=document.getElementById("navToggle"),t=document.getElementById("nav");e&&t&&(e.addEventListener("click",()=>{t.classList.toggle("open"),e.classList.toggle("active")}),document.addEventListener("click",r=>{t.classList.contains("open")&&!t.contains(r.target)&&!e.contains(r.target)&&(t.classList.remove("open"),e.classList.remove("active"))}),t.querySelectorAll("a").forEach(r=>{r.addEventListener("click",()=>{t.classList.remove("open"),e.classList.remove("active")})}));const a=document.getElementById("themeToggle");if(a){const r=l();i(a,r),a.addEventListener("click",()=>{const o=d();i(a,o),window.dispatchEvent(new CustomEvent("themeChanged",{detail:{theme:o}}))})}}export{l as a,h as i};
