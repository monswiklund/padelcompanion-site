import React from "react";
import { HistorySection } from "@/components/tournament/HistorySection";

const HistoryPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      <div className="text-center max-w-lg mx-auto mb-8">
        <h2 className="text-3xl font-bold text-primary mb-2">
          Tournament History
        </h2>
        <p className="text-secondary">
          View, load, and manage your past tournaments.
        </p>
      </div>

      <HistorySection />
    </div>
  );
};

export default HistoryPage;
