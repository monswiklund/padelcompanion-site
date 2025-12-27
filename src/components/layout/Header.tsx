import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { initTheme, toggleTheme, updateThemeIcon } from "@/shared/theme";

const Header: React.FC = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [theme, setTheme] = useState<string>("dark");
  const location = useLocation();

  useEffect(() => {
    const currentTheme = initTheme();
    setTheme(currentTheme);
  }, []);

  const handleToggleTheme = () => {
    const newTheme = toggleTheme();
    setTheme(newTheme);
    window.dispatchEvent(
      new CustomEvent("themeChanged", { detail: { theme: newTheme } })
    );
  };

  const closeNav = () => {
    setIsNavOpen(false);
  };

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return "active";
    if (path !== "/" && location.pathname.startsWith(path)) return "active";
    return "";
  };

  return (
    <header className="header scrolled">
      <div className="container header-inner">
        <Link to="/" className="logo" onClick={closeNav}>
          <img src="/assets/app-icon.jpeg" alt="Padel Companion Logo" />
          <span>Padel Companion</span>
        </Link>
        <div className="header-actions">
          <nav className={`nav ${isNavOpen ? "open" : ""}`} id="nav">
            <Link to="/" className={isActive("/")} onClick={closeNav}>
              Home
            </Link>
            <a
              href="/#features"
              className={location.hash === "#features" ? "active" : ""}
              onClick={closeNav}
            >
              Features
            </a>
            <div className="nav-dropdown">
              <span
                className={`nav-dropdown-trigger ${
                  location.pathname.startsWith("/tournament") ? "active" : ""
                }`}
              >
                Tournament
                <span className="dropdown-arrow">▾</span>
              </span>
              <div className="nav-dropdown-menu">
                <Link
                  to="/tournament/generator"
                  className="nav-dropdown-item"
                  onClick={closeNav}
                >
                  Generator
                </Link>
                <Link
                  to="/tournament/bracket"
                  className="nav-dropdown-item"
                  onClick={closeNav}
                >
                  Bracket
                </Link>
                <Link
                  to="/tournament/winners-court"
                  className="nav-dropdown-item"
                  onClick={closeNav}
                >
                  Winners
                </Link>
              </div>
            </div>
            <Link
              to="/support"
              className={isActive("/support")}
              onClick={closeNav}
            >
              Support
            </Link>
          </nav>
          <button
            className="theme-toggle"
            onClick={handleToggleTheme}
            title="Toggle theme"
          >
            <span className="theme-icon">{theme === "dark" ? "🌙" : "☀️"}</span>
          </button>
          <button
            className={`nav-toggle ${isNavOpen ? "active" : ""}`}
            onClick={() => setIsNavOpen(!isNavOpen)}
            aria-label="Toggle menu"
          >
            <span className="hamburger"></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
