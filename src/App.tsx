import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { TournamentProvider } from "./context/TournamentContext";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import SmoothScroll from "./components/layout/SmoothScroll";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const SupportPage = lazy(() => import("./pages/SupportPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const GeneratorPage = lazy(() => import("./tournament/pages/generator/GeneratorPage"));
const BracketPage = lazy(() => import("./tournament/pages/bracket/BracketPage"));
const DivisionPage = lazy(() => import("./tournament/pages/division/DivisionPage"));
const WinnersCourtPage = lazy(
  () => import("./tournament/pages/winnersCourt/WinnersCourtPage"),
);
const HistoryPage = lazy(() => import("./tournament/pages/history/HistoryPage"));
const SharedTournamentPage = lazy(
  () => import("./tournament/pages/shared/SharedTournamentPage"),
);

const PageLoader: React.FC = () => (
  <div className="min-h-[50vh] flex items-center justify-center px-4 text-center text-muted-foreground">
    Loading...
  </div>
);

const TournamentLayout: React.FC = () => (
  <TournamentProvider>
    <Outlet />
  </TournamentProvider>
);

const App: React.FC = () => {
  return (
    <Router>
      <SmoothScroll>
        <div className="min-h-screen flex flex-col bg-background text-foreground">
          <Header />
          <main className="flex-1 pt-20">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/tournament" element={<TournamentLayout />}>
                  <Route path="generator" element={<GeneratorPage />} />
                  <Route path="division" element={<DivisionPage />} />
                  <Route path="session/:shareCode" element={<SharedTournamentPage />} />
                  <Route path="bracket" element={<BracketPage />} />
                  <Route path="winners-court" element={<WinnersCourtPage />} />
                  <Route path="history" element={<HistoryPage />} />
                </Route>

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
            </Suspense>
          </main>
          <Footer />
        </div>
      </SmoothScroll>
    </Router>
  );
};

export default App;
