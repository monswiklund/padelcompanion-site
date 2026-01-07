import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { applySeo } from "@/shared/seo";

const TournamentLandingPage: React.FC = () => {
  useEffect(() => {
    const cleanupSeo = applySeo({
      title: "Padel Mexicano Generator | Padel Companion Tournament Tools",
      description:
        "Create Mexicano, Americano, Winners Court, and bracket tournaments. Auto-generate rounds, track scores, and manage padel events on any device.",
      canonical: "https://padelcompanion.se/tournament/",
      ogUrl: "https://padelcompanion.se/tournament/",
      ogImage: "https://padelcompanion.se/assets/app-icon.jpeg",
      ogImageAlt: "Padel Companion tournament generator",
      twitterCard: "summary",
    });

    const existing = document.getElementById("tournament-landing-jsonld");
    if (existing) existing.remove();

    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          name: "Padel Mexicano Generator",
          url: "https://padelcompanion.se/tournament/",
          description:
            "Padel Mexicano and Americano tournament generator with live scoring, automatic scheduling, and mobile-first workflows.",
        },
        {
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "What is Mexicano in padel?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Mexicano is a format where partners rotate and rankings update after every round, so top players face each other as the event progresses.",
              },
            },
            {
              "@type": "Question",
              name: "Does the generator handle uneven player counts?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. The scheduler includes automatic bye handling and highlights who sits out each round.",
              },
            },
            {
              "@type": "Question",
              name: "Can I share results?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "You can export results, save them to history, and continue later from the same device.",
              },
            },
          ],
        },
      ],
    };

    const script = document.createElement("script");
    script.id = "tournament-landing-jsonld";
    script.type = "application/ld+json";
    script.text = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    return () => {
      cleanupSeo();
      script.remove();
    };
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-accent-glow)_0%,transparent_70%)] opacity-20 pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <p className="text-accent font-semibold uppercase tracking-wider mb-4 animate-fade-in">
            The Tournament Suite
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6 animate-fade-in-up">
            Run your Padel tournaments on autopilot
          </h1>
          <p className="text-xl text-secondary max-w-2xl mx-auto mb-10 animate-fade-in-up animation-delay-100">
            Say goodbye to spreadsheets. Whether it's a social Mexicano mixer or
            a competitive Bracket, organizing your next event just got
            effortless.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-fade-in-up animation-delay-200">
            <Link
              to="/tournament/generator"
              className="px-8 py-4 bg-accent hover:bg-accent-dark text-white font-semibold rounded-xl transition-all hover:shadow-glow"
            >
              Start a Mexicano or Americano
            </Link>
            <Link
              to="/tournament/bracket"
              className="px-8 py-4 bg-card hover:bg-elevated border border-theme text-primary font-semibold rounded-xl transition-colors"
            >
              Create a Bracket
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted mb-8">
            <a href="#formats" className="hover:text-accent transition-colors">
              See all formats
            </a>
            <a href="#workflow" className="hover:text-accent transition-colors">
              How it works
            </a>
            <a href="#faq" className="hover:text-accent transition-colors">
              FAQ
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm animate-fade-in-up animation-delay-300">
            <span className="flex items-center gap-2 text-secondary">
              <span className="text-success">✓</span> Instant scheduling
            </span>
            <span className="flex items-center gap-2 text-secondary">
              <span className="text-success">✓</span> Real-time leaderboards
            </span>
            <span className="flex items-center gap-2 text-secondary">
              <span className="text-success">✓</span> No signup required
            </span>
          </div>
        </div>
      </section>

      {/* Formats Section */}
      <section id="formats" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Pick your game mode
            </h2>
            <p className="text-secondary text-lg">
              From friendly club nights to serious competition, we have a format
              that fits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              to="/tournament/generator"
              className="group bg-card border border-theme rounded-2xl p-6 hover:border-accent transition-all hover:-translate-y-1"
            >
              <span className="inline-block text-xs font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full mb-4">
                The Social Favorite
              </span>
              <h3 className="text-2xl font-bold text-primary mb-3">Mexicano</h3>
              <p className="text-secondary">
                The ultimate mixer. Partners rotate every match, and the system
                intelligently pairs players of similar skill levels as the
                tournament progresses.
              </p>
            </Link>

            <Link
              to="/tournament/generator"
              className="group bg-card border border-theme rounded-2xl p-6 hover:border-accent transition-all hover:-translate-y-1"
            >
              <span className="inline-block text-xs font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full mb-4">
                Classic & Fair
              </span>
              <h3 className="text-2xl font-bold text-primary mb-3">
                Americano
              </h3>
              <p className="text-secondary">
                Perfectly balanced. Every player partners with everyone else
                exactly once. A fair and structured way to find the true
                champion of the group.
              </p>
            </Link>

            <Link
              to="/tournament/winners-court"
              className="group bg-card border border-theme rounded-2xl p-6 hover:border-accent transition-all hover:-translate-y-1"
            >
              <span className="inline-block text-xs font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full mb-4">
                King of the Hill
              </span>
              <h3 className="text-2xl font-bold text-primary mb-3">
                Winners Court
              </h3>
              <p className="text-secondary">
                Win and move up, lose and move down. The goal is simple: reach
                the top court and stay there. High energy and fast-paced fun.
              </p>
            </Link>

            <Link
              to="/tournament/bracket"
              className="group bg-card border border-theme rounded-2xl p-6 hover:border-accent transition-all hover:-translate-y-1"
            >
              <span className="inline-block text-xs font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full mb-4">
                Tournament Mode
              </span>
              <h3 className="text-2xl font-bold text-primary mb-3">
                Knockout Bracket
              </h3>
              <p className="text-secondary">
                The road to the trophy. Set up a classic elimination tournament,
                seed your top teams, and let the drama unfold.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="py-20 bg-secondary/5">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
            Why use Padel Companion?
          </h2>
          <p className="text-secondary text-lg mb-8">
            We built this because we were tired of managing complex Excel sheets
            on our phones.
          </p>
          <ul className="space-y-4">
            <li className="flex items-start gap-4">
              <span className="text-accent text-xl">✓</span>
              <div>
                <strong className="text-primary">Dead simple setup.</strong>{" "}
                <span className="text-secondary">
                  You don't need a manual. Just add players, courts, and go.
                </span>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-accent text-xl">✓</span>
              <div>
                <strong className="text-primary">Works on any device.</strong>{" "}
                <span className="text-secondary">
                  iOS, Android, or your laptop. Everyone can track the score
                  from their own phone.
                </span>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-accent text-xl">✓</span>
              <div>
                <strong className="text-primary">Smart logic.</strong>{" "}
                <span className="text-secondary">
                  We handle the uneven numbers, the byes, and the tie-breakers
                  so you don't have to.
                </span>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* How It Works & FAQ Section */}
      <section id="workflow" className="py-20">
        <div className="max-w-4xl mx-auto px-6 grid md:grid-cols-2 gap-8">
          <div className="bg-card border border-theme rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-primary mb-6">
              How it works
            </h2>
            <ol className="space-y-4 text-secondary">
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center font-bold text-sm">
                  1
                </span>
                <span>
                  Add players and courts, then pick Mexicano or Americano.
                </span>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center font-bold text-sm">
                  2
                </span>
                <span>Auto-generate the full schedule in one tap.</span>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center font-bold text-sm">
                  3
                </span>
                <span>
                  Enter scores, track standings, and finish with a ranking.
                </span>
              </li>
            </ol>
          </div>

          <div id="faq" className="bg-card border border-theme rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-primary mb-6">
              Padel Mexicano FAQ
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-primary mb-2">
                  What is Mexicano in padel?
                </h3>
                <p className="text-secondary text-sm">
                  Mexicano is a format where partners rotate and rankings update
                  after every round, so top players face each other as the event
                  progresses.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-primary mb-2">
                  Does the generator handle uneven player counts?
                </h3>
                <p className="text-secondary text-sm">
                  Yes. The scheduler includes automatic bye handling and
                  highlights who sits out each round.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-primary mb-2">
                  Can I share results?
                </h3>
                <p className="text-secondary text-sm">
                  You can export results, save them to history, and continue
                  later from the same device.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-accent/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Ready to run your next padel tournament?
          </h2>
          <p className="text-secondary text-lg mb-8">
            Open the generator to create a Mexicano or Americano schedule, or
            jump into a bracket in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/tournament/generator"
              className="px-8 py-4 bg-accent hover:bg-accent-dark text-white font-semibold rounded-xl transition-all hover:shadow-glow"
            >
              Launch Tournament Generator
            </Link>
            <Link
              to="/tournament/winners-court"
              className="px-8 py-4 bg-card hover:bg-elevated border border-theme text-primary font-semibold rounded-xl transition-colors"
            >
              Try Winners Court
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TournamentLandingPage;
