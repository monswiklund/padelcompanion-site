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
const GeneratorPage = () => (
  <div style={{ padding: "150px 20px", textAlign: "center" }}>
    <h1>Generator Page Migration in Progress</h1>
  </div>
);
const BracketPage = () => (
  <div style={{ padding: "150px 20px", textAlign: "center" }}>
    <h1>Bracket Page Migration in Progress</h1>
  </div>
);
const WinnersCourtPage = () => (
  <div style={{ padding: "150px 20px", textAlign: "center" }}>
    <h1>Winners Court Migration in Progress</h1>
  </div>
);

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

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </TournamentProvider>
  );
};

export default App;
