import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  return (
    <div className="not-found-page container py-20 text-center animate-fade-in">
      <h1 className="text-6xl font-bold text-white mb-4">404</h1>
      <p className="text-xl text-text-muted mb-8">
        Oops! The page you're looking for doesn't exist.
      </p>
      <div className="flex gap-4 justify-center">
        <Link to="/" className="btn btn-primary">
          Go Home
        </Link>
        <Link to="/tournament/generator" className="btn btn-secondary">
          Start Tournament
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
