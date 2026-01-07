import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 animate-fade-in">
      <h1 className="text-8xl font-bold text-accent mb-4">404</h1>
      <p className="text-xl text-secondary mb-8 text-center">
        Oops! The page you're looking for doesn't exist.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/"
          className="px-6 py-3 bg-accent hover:bg-accent-dark text-white font-medium rounded-xl transition-colors text-center"
        >
          Go Home
        </Link>
        <Link
          to="/tournament/generator"
          className="px-6 py-3 bg-card hover:bg-elevated border border-theme text-primary font-medium rounded-xl transition-colors text-center"
        >
          Start Tournament
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
