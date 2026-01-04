import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { TournamentProvider } from "./context/TournamentContext";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import LandingPage from "./pages/LandingPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import SupportPage from "./pages/SupportPage";

// Placeholder components for Phase 3 migration
import GeneratorPage from "./tournament/pages/generator/GeneratorPage";
import BracketPage from "./tournament/pages/bracket/BracketPage";
import WinnersCourtPage from "./tournament/pages/winnersCourt/WinnersCourtPage";
import HistoryPage from "./tournament/pages/history/HistoryPage";
import NotFoundPage from "./pages/NotFoundPage";

const App: React.FC = () => {
  return (
    <TournamentProvider>
      <Router>
        <div className="app-wrapper">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/tournament/generator" element={<GeneratorPage />} />
              <Route path="/tournament/bracket" element={<BracketPage />} />
              <Route
                path="/tournament/winners-court"
                element={<WinnersCourtPage />}
              />
              <Route path="/tournament/history" element={<HistoryPage />} />

              {/* Support & Legal */}
              <Route path="/support" element={<SupportPage />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />

              {/* Alias routes that also link to Support */}
              <Route path="/contact" element={<SupportPage />} />
              <Route path="/delete-account" element={<SupportPage />} />

              {/* Redirects for legacy URLs */}
              <Route path="/index.html" element={<Navigate to="/" replace />} />
              <Route
                path="/support.html"
                element={<Navigate to="/support" replace />}
              />
              <Route
                path="/privacy.html"
                element={<Navigate to="/privacy" replace />}
              />
              <Route
                path="/terms.html"
                element={<Navigate to="/terms" replace />}
              />

              {/* 404 Page */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </TournamentProvider>
  );
};

export default App;
