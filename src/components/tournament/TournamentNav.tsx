import React from "react";
import { NavLink } from "react-router-dom";

export const TournamentNav: React.FC = () => {
  return (
    <nav className="page-nav animate-fade-in">
      <div className="page-nav-tabs">
        <NavLink
          to="/tournament/generator"
          className={({ isActive }) =>
            `page-nav-tab ${isActive ? "active" : ""}`
          }
        >
          <span className="tab-label">Americano</span>
        </NavLink>
        <NavLink
          to="/tournament/bracket"
          className={({ isActive }) =>
            `page-nav-tab ${isActive ? "active" : ""}`
          }
        >
          <span className="tab-label">Bracket</span>
        </NavLink>
        <NavLink
          to="/tournament/winners-court"
          className={({ isActive }) =>
            `page-nav-tab ${isActive ? "active" : ""}`
          }
        >
          <span className="tab-label">Winner's Court</span>
        </NavLink>
      </div>
    </nav>
  );
};
