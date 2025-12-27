import React from "react";
import { HistorySection } from "@/components/tournament/HistorySection";

const HistoryPage: React.FC = () => {
  return (
    <div className="history-page tournament-page container animate-fade-in">
      <div className="page-intro-header">
        <h2>Tournament History</h2>
        <p>View, load, and manage your past tournaments.</p>
      </div>

      <HistorySection />
    </div>
  );
};

export default HistoryPage;