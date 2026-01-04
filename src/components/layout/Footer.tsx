import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <Link to="/" className="logo">
              <img src="/assets/app-icon.jpeg" alt="Padel Companion Logo" />
              <span>Padel Companion</span>
            </Link>
            <p>
              Your digital padel companion. Track scores, view statistics, and
              organize tournaments with ease.
            </p>
          </div>

          <div className="footer-links-row">
            <div className="footer-links">
              <h5>Legal</h5>
              <ul>
                <li>
                  <Link to="/privacy">Privacy Policy</Link>
                </li>
                <li>
                  <Link to="/terms">Terms of Service</Link>
                </li>
              </ul>
            </div>

            <div className="footer-links">
              <h5>Support</h5>
              <ul>
                <li>
                  <Link to="/support">Help & FAQ</Link>
                </li>
                <li>
                  <Link to="/contact">Contact Us</Link>
                </li>
                <li>
                  <Link to="/delete-account">Delete my account</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-donate">
            <h5
              style={{
                color: "var(--text-muted)",
                fontSize: "0.875rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontWeight: 600,
                marginBottom: "var(--space-lg)",
              }}
            >
              Donate
            </h5>
            <a
              href="https://buymeacoffee.com/wiklundlabs"
              target="_blank"
              rel="noopener"
              className="footer-donate-btn"
            >
              <img
                src="/assets/buymeacoffee.png"
                alt="Buy Me A Coffee"
                loading="lazy"
                style={{ height: "40px !important", width: "145px !important" }}
              />
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {year} Padel Companion. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
