import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { initTheme, toggleTheme } from "@/shared/theme";

const Header: React.FC = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [theme, setTheme] = useState<string>("dark");
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const currentTheme = initTheme();
    setTheme(currentTheme);

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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

  const NavLink = ({
    to,
    children,
  }: {
    to: string;
    children: React.ReactNode;
  }) => {
    const isHome = to === "/";
    const isHistory = to === "/tournament/history";
    const isTournament = to === "/tournament/generator";

    let active = false;
    if (isHome && location.pathname === "/") active = true;
    else if (isHistory && location.pathname === "/tournament/history")
      active = true;
    else if (
      isTournament &&
      location.pathname.startsWith("/tournament") &&
      !location.pathname.startsWith("/tournament/history")
    )
      active = true;
    else if (to === "/support" && location.pathname.startsWith("/support"))
      active = true;

    return (
      <Link
        to={to}
        onClick={closeNav}
        className={`text-sm font-medium transition-colors ${
          active
            ? "text-accent font-semibold"
            : "text-secondary hover:text-primary"
        }`}
      >
        {children}
      </Link>
    );
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[500] transition-all duration-300 ${
        scrolled
          ? "bg-primary/95 backdrop-blur-md border-b border-theme py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container max-w-[1200px] mx-auto px-6 h-full flex items-center justify-between">
        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold text-primary z-50 relative"
          onClick={closeNav}
        >
          <img
            src="/assets/app-icon.jpeg"
            alt="Padel Companion Logo"
            className="w-9 h-9 rounded-lg"
          />
          <span>Padel Companion</span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/tournament/history">History</NavLink>
          <NavLink to="/tournament/generator">Tournament</NavLink>
          <NavLink to="/support">Support</NavLink>
        </nav>

        {/* ACTIONS & MOBILE TOGGLE */}
        <div className="flex items-center gap-3 z-50 relative">
          <button
            className="w-9 h-9 flex items-center justify-center rounded-full bg-card hover:bg-elevated transition-colors text-primary"
            onClick={handleToggleTheme}
            title="Toggle theme"
          >
            <span className="text-lg">{theme === "dark" ? "🌙" : "☀️"}</span>
          </button>

          {/* Hamburger Menu (Mobile) */}
          <button
            className="md:hidden flex flex-col justify-center gap-1.5 w-8 h-8 p-1"
            onClick={() => setIsNavOpen(!isNavOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-0.5 bg-[var(--color-text-primary)] rounded-full transition-all duration-300 ${
                isNavOpen ? "rotate-45 translate-y-2" : ""
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-[var(--color-text-primary)] rounded-full transition-all duration-300 ${
                isNavOpen ? "opacity-0" : ""
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-[var(--color-text-primary)] rounded-full transition-all duration-300 ${
                isNavOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            ></span>
          </button>
        </div>
      </div>

      {/* MOBILE NAVIGATION OVERLAY */}
      <div
        className={`fixed inset-0 bg-primary z-[400] flex flex-col items-center justify-center gap-8 transition-transform duration-300 md:hidden ${
          isNavOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <Link
          to="/"
          className="text-2xl font-medium text-primary"
          onClick={closeNav}
        >
          Home
        </Link>
        <Link
          to="/tournament/history"
          className="text-2xl font-medium text-primary"
          onClick={closeNav}
        >
          History
        </Link>
        <Link
          to="/tournament/generator"
          className="text-2xl font-medium text-primary"
          onClick={closeNav}
        >
          Tournament
        </Link>
        <Link
          to="/support"
          className="text-2xl font-medium text-primary"
          onClick={closeNav}
        >
          Support
        </Link>
      </div>
    </header>
  );
};

export default Header;
