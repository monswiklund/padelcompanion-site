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
    <div className="tournament-landing tournament-page">
      <section className="tournament-landing__hero">
        <div className="container hero-grid">
          <div className="hero-copy centered">
            <p className="tournament-landing__eyebrow">
              Padel Companion Tournaments
            </p>
            <h1>Padel Mexicano generator built for fast tournaments</h1>
            <p className="tournament-landing__lead">
              Launch Mexicano, Americano, Winners Court, or bracket events in
              minutes. Auto-generate rounds, handle byes, and track a live
              leaderboard from any phone.
            </p>
            <div className="tournament-landing__cta">
              <Link
                to="/tournament/generator"
                className="btn btn-primary btn-lg"
              >
                Open Mexicano & Americano Generator
              </Link>
              <Link to="/tournament/bracket" className="btn btn-outline btn-lg">
                Build Bracket Tournament
              </Link>
            </div>
            <div className="hero-links">
              <a href="#formats">Compare formats</a>
              <a href="#workflow">How it works</a>
              <a href="#faq">Padel Mexicano FAQ</a>
            </div>
            <div className="tournament-landing__trust">
              <span>Auto schedule</span>
              <span>Live scores</span>
              <span>Works on mobile</span>
              <span>Free to use</span>
            </div>
          </div>
        </div>
      </section>

      <section id="formats" className="tournament-landing__formats container">
        <div className="section-header centered">
          <h2>Choose your tournament format</h2>
          <p>
            Each format is optimized for different padel events, from social
            mixers to competitive ladders.
          </p>
        </div>
        <div className="format-grid">
          <Link to="/tournament/generator" className="format-card-link">
            <article className="format-card">
              <span className="format-tag">Best for ladders</span>
              <h3>Mexicano tournament generator</h3>
              <p>
                Rotate partners each round and match players by ranking. Perfect
                for social events and competitive ladders.
              </p>
            </article>
          </Link>
          <Link to="/tournament/generator" className="format-card-link">
            <article className="format-card">
              <span className="format-tag">Classic rotation</span>
              <h3>Americano tournament generator</h3>
              <p>
                Balanced partner rotations with fixed round structure. The
                classic padel americano format made simple.
              </p>
            </article>
          </Link>
          <Link to="/tournament/winners-court" className="format-card-link">
            <article className="format-card">
              <span className="format-tag">Club nights</span>
              <h3>Winners Court format</h3>
              <p>
                King of the hill for padel. Winners move up courts, losers move
                down. Great for club nights.
              </p>
            </article>
          </Link>
          <Link to="/tournament/bracket" className="format-card-link">
            <article className="format-card">
              <span className="format-tag">Knockout</span>
              <h3>Bracket tournament generator</h3>
              <p>
                Single elimination brackets for fast knockout events. Add teams,
                seed players, and play to a final.
              </p>
            </article>
          </Link>
        </div>
      </section>

      <section id="workflow" className="tournament-landing__details container">
        <div className="details-card">
          <h2>How the padel tournament scheduler works</h2>
          <ol>
            <li>Add players and courts, then pick Mexicano or Americano.</li>
            <li>Auto-generate the full schedule in one tap.</li>
            <li>Enter scores, track standings, and finish with a ranking.</li>
          </ol>
        </div>
        <div id="faq" className="details-card">
          <h2>Padel Mexicano FAQ</h2>
          <div className="faq-item">
            <h3>What is Mexicano in padel?</h3>
            <p>
              Mexicano is a format where partners rotate and rankings update
              after every round, so top players face each other as the event
              progresses.
            </p>
          </div>
          <div className="faq-item">
            <h3>Does the generator handle uneven player counts?</h3>
            <p>
              Yes. The scheduler includes automatic bye handling and highlights
              who sits out each round.
            </p>
          </div>
          <div className="faq-item">
            <h3>Can I share results?</h3>
            <p>
              You can export results, save them to history, and continue later
              from the same device.
            </p>
          </div>
        </div>
      </section>

      <section className="tournament-landing__cta-final">
        <div className="container cta-final__inner">
          <div>
            <h2>Ready to run your next padel tournament?</h2>
            <p>
              Open the generator to create a Mexicano or Americano schedule,
              or jump into a bracket in seconds.
            </p>
          </div>
          <div className="cta-final__actions">
            <Link to="/tournament/generator" className="btn btn-primary btn-lg">
              Launch Tournament Generator
            </Link>
            <Link to="/tournament/winners-court" className="btn btn-outline">
              Try Winners Court
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TournamentLandingPage;
