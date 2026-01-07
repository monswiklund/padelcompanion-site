import React from "react";
import { NavLink } from "react-router-dom";

export const TournamentNav: React.FC = () => {
  const linkBaseClasses =
    "px-4 py-2 text-sm font-medium rounded-lg transition-colors";
  const activeClasses = "bg-accent text-white";
  const inactiveClasses = "text-secondary hover:text-primary hover:bg-white/5";

  return (
    <nav className="flex justify-center gap-2 p-4 animate-fade-in">
      <NavLink
        to="/tournament/generator"
        className={({ isActive }) =>
          `${linkBaseClasses} ${isActive ? activeClasses : inactiveClasses}`
        }
      >
        Americano
      </NavLink>
      <NavLink
        to="/tournament/bracket"
        className={({ isActive }) =>
          `${linkBaseClasses} ${isActive ? activeClasses : inactiveClasses}`
        }
      >
        Bracket
      </NavLink>
      <NavLink
        to="/tournament/winners-court"
        className={({ isActive }) =>
          `${linkBaseClasses} ${isActive ? activeClasses : inactiveClasses}`
        }
      >
        Winner's Court
      </NavLink>
    </nav>
  );
};
