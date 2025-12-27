import React from "react";
import { HistorySection } from "@/components/tournament/HistorySection";

const HistoryPage: React.FC = () => {
  return (
    <div className="history-page container py-8 animate-fade-in">
      <div className="page-intro-header text-center max-w-[600px] mx-auto mb-8 px-4">
        <h2 className="text-3xl mb-1 text-white">Tournament History</h2>
        <p className="text-text-muted">
          View, load, and manage your past tournaments.
        </p>
      </div>

      <HistorySection />
    </div>
  );
};

export default HistoryPage;
