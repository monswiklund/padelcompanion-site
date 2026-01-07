import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-bg-secondary border-t border-white/[0.08] pt-16 pb-8 mt-auto">
      <div className="container max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col items-center text-center gap-12 mb-12">
          <div className="max-w-[500px] mx-auto">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 font-display text-xl font-bold text-text-primary mb-4"
            >
              <img
                src="/assets/app-icon.jpeg"
                alt="Padel Companion Logo"
                className="w-10 h-10 rounded-xl"
              />
              <span>Padel Companion</span>
            </Link>
            <p className="text-text-secondary">
              Your digital padel companion. Track scores, view statistics, and
              organize tournaments with ease.
            </p>
          </div>

          <div className="flex justify-center flex-wrap gap-12 md:gap-24">
            <div className="text-left">
              <h5 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-6">
                Legal
              </h5>
              <ul className="flex flex-col gap-2 list-none p-0 m-0">
                <li>
                  <Link
                    to="/privacy"
                    className="text-text-secondary hover:text-text-primary transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="text-text-secondary hover:text-text-primary transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            <div className="text-left">
              <h5 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-6">
                Support
              </h5>
              <ul className="flex flex-col gap-2 list-none p-0 m-0">
                <li>
                  <Link
                    to="/support"
                    className="text-text-secondary hover:text-text-primary transition-colors"
                  >
                    Help & FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-text-secondary hover:text-text-primary transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/delete-account"
                    className="text-text-secondary hover:text-text-primary transition-colors"
                  >
                    Delete my account
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-4">
            <h5 className="text-text-muted text-sm uppercase tracking-wider font-semibold mb-6">
              Donate
            </h5>
            <a
              href="https://buymeacoffee.com/wiklundlabs"
              target="_blank"
              rel="noopener"
              className="inline-block transition-transform hover:-translate-y-0.5"
            >
              <img
                src="/assets/buymeacoffee.png"
                alt="Buy Me A Coffee"
                loading="lazy"
                style={{ height: "40px", width: "145px" }}
              />
            </a>
          </div>
        </div>

        <div className="pt-8 border-t border-white/[0.08] text-center text-text-muted text-sm">
          <p>&copy; {year} Padel Companion. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
