import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { cn } from "@/shared/utils";
import { initTheme, toggleTheme } from "@/shared/theme";
import { MoonIcon, SunIcon } from "@/components/ui/Icons";
import {
  getLastTournamentRoute,
  isRememberedTournamentRoute,
  rememberTournamentRoute,
} from "@/tournament/navigation";

const Header: React.FC = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [theme, setTheme] = useState<string>("dark");
  const [scrolled, setScrolled] = useState(false);
  const [tournamentLink, setTournamentLink] = useState("/tournament/generator");
  const location = useLocation();

  useEffect(() => {
    const currentTheme = initTheme();
    setTheme(currentTheme);
    setTournamentLink(getLastTournamentRoute());

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isRememberedTournamentRoute(location.pathname)) {
      return;
    }

    rememberTournamentRoute(location.pathname);
    setTournamentLink(location.pathname);
  }, [location.pathname]);

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

  const CustomNavLink = ({
    to,
    children,
    end = false,
  }: {
    to: string;
    children: React.ReactNode;
    end?: boolean;
  }) => {
    return (
      <NavLink
        to={to}
        end={end}
        onClick={closeNav}
        className={({ isActive }) => {
          // Special case for Tournament tab to remain active on all tournament sub-pages except history
          const isTournamentTab = to === tournamentLink;
          const isTournamentActive = 
            isTournamentTab && 
            location.pathname.startsWith("/tournament") && 
            !location.pathname.startsWith("/tournament/history");

          const active = isActive || isTournamentActive;

          return cn(
            "text-sm font-medium transition-colors",
            active
              ? "text-accent font-semibold"
              : "text-muted-foreground hover:text-foreground"
          );
        }}
      >
        {children}
      </NavLink>
    );
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-[500] transition-all duration-300",
        scrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="container max-w-[1200px] mx-auto px-6 h-full flex items-center justify-between">
        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold text-foreground z-50 relative"
          onClick={closeNav}
        >
          <img
            src="/assets/app-icon.jpeg"
            alt="Padel Companion Logo"
            width={36}
            height={36}
            className="w-9 h-9 rounded-lg"
          />
          <span>Padel Companion</span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          <CustomNavLink to="/" end>Home</CustomNavLink>
          <CustomNavLink to="/tournament/history">History</CustomNavLink>
          <CustomNavLink to={tournamentLink}>Tournament</CustomNavLink>
          <CustomNavLink to="/support">Support</CustomNavLink>
        </nav>

        {/* ACTIONS & MOBILE TOGGLE */}
        <div className="flex items-center gap-3 z-50 relative">
          <button
            className="w-9 h-9 flex items-center justify-center rounded-full bg-card hover:bg-popover transition-colors text-foreground"
            onClick={handleToggleTheme}
            title="Toggle theme"
          >
            <span className="flex items-center text-foreground">
              {theme === "dark" ? <MoonIcon size={18} /> : <SunIcon size={18} />}
            </span>
          </button>

          {/* Hamburger Menu (Mobile) */}
          <button
            className="md:hidden flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full bg-card/80 p-2 text-foreground backdrop-blur-sm"
            onClick={() => setIsNavOpen(!isNavOpen)}
            aria-label="Toggle menu"
            aria-expanded={isNavOpen}
            aria-controls="mobile-navigation"
          >
            <span
              className={cn(
                "block h-0.5 w-6 rounded-full bg-foreground transition-all duration-300",
                isNavOpen && "rotate-45 translate-y-2"
              )}
            ></span>
            <span
              className={cn(
                "block h-0.5 w-6 rounded-full bg-foreground transition-all duration-300",
                isNavOpen && "opacity-0"
              )}
            ></span>
            <span
              className={cn(
                "block h-0.5 w-6 rounded-full bg-foreground transition-all duration-300",
                isNavOpen && "-rotate-45 -translate-y-2"
              )}
            ></span>
          </button>
        </div>
      </div>

      {/* MOBILE NAVIGATION OVERLAY */}
      <div
        id="mobile-navigation"
        className={cn(
          "fixed inset-0 bg-background z-[400] flex flex-col items-center justify-center gap-8 transition-transform duration-300 md:hidden",
          isNavOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <button
          type="button"
          onClick={closeNav}
          aria-label="Close menu"
          className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-card/80 text-foreground backdrop-blur-sm"
        >
          <span className="text-2xl leading-none">&times;</span>
        </button>
        <NavLink
          to="/"
          end
          className={({ isActive }) => cn("text-2xl font-medium transition-colors", isActive ? "text-accent font-bold" : "text-foreground")}
          onClick={closeNav}
        >
          Home
        </NavLink>
        <NavLink
          to="/tournament/history"
          className={({ isActive }) => cn("text-2xl font-medium transition-colors", isActive ? "text-accent font-bold" : "text-foreground")}
          onClick={closeNav}
        >
          History
        </NavLink>
        <NavLink
          to={tournamentLink}
          className={() => {
            const isTournamentActive = location.pathname.startsWith("/tournament") && !location.pathname.startsWith("/tournament/history");
            return cn("text-2xl font-medium transition-colors", isTournamentActive ? "text-accent font-bold" : "text-foreground");
          }}
          onClick={closeNav}
        >
          Tournament
        </NavLink>
        <NavLink
          to="/support"
          className={({ isActive }) => cn("text-2xl font-medium transition-colors", isActive ? "text-accent font-bold" : "text-foreground")}
          onClick={closeNav}
        >
          Support
        </NavLink>
      </div>
    </header>
  );
};

export default Header;
