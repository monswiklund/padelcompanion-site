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
              The Tournament Suite
            </p>
            <h1>Run your Padel tournaments on autopilot</h1>
            <p className="tournament-landing__lead">
              Say goodbye to spreadsheets. Whether it's a social Mexicano mixer or a competitive Bracket, organizing your next event just got effortless.
            </p>
            <div className="tournament-landing__cta">
              <Link
                to="/tournament/generator"
                className="btn btn-primary btn-lg"
              >
                Start a Mexicano or Americano
              </Link>
              <Link to="/tournament/bracket" className="btn btn-outline btn-lg">
                Create a Bracket
              </Link>
            </div>
            <div className="hero-links">
              <a href="#formats">See all formats</a>
              <a href="#workflow">How it works</a>
              <a href="#faq">FAQ</a>
            </div>
            <div className="tournament-landing__trust">
              <span>Instant scheduling</span>
              <span>Real-time leaderboards</span>
              <span>No signup required</span>
            </div>
          </div>
        </div>
      </section>

      <section id="formats" className="tournament-landing__formats container">
        <div className="section-header centered">
          <h2>Pick your game mode</h2>
          <p>
            From friendly club nights to serious competition, we have a format that fits.
          </p>
        </div>
        <div className="format-grid">
          <Link to="/tournament/generator" className="format-card-link">
            <article className="format-card">
              <span className="format-tag">The Social Favorite</span>
              <h3>Mexicano</h3>
              <p>
                The ultimate mixer. Partners rotate every match, and the system intelligently pairs players of similar skill levels as the tournament progresses.
              </p>
            </article>
          </Link>
          <Link to="/tournament/generator" className="format-card-link">
            <article className="format-card">
              <span className="format-tag">Classic & Fair</span>
              <h3>Americano</h3>
              <p>
                Perfectly balanced. Every player partners with everyone else exactly once. A fair and structured way to find the true champion of the group.
              </p>
            </article>
          </Link>
          <Link to="/tournament/winners-court" className="format-card-link">
            <article className="format-card">
              <span className="format-tag">King of the Hill</span>
              <h3>Winners Court</h3>
              <p>
                Win and move up, lose and move down. The goal is simple: reach the top court and stay there. High energy and fast-paced fun.
              </p>
            </article>
          </Link>
          <Link to="/tournament/bracket" className="format-card-link">
            <article className="format-card">
              <span className="format-tag">Tournament Mode</span>
              <h3>Knockout Bracket</h3>
              <p>
                The road to the trophy. Set up a classic elimination tournament, seed your top teams, and let the drama unfold.
              </p>
            </article>
          </Link>
        </div>
      </section>

      <section className="tournament-landing__why container">
        <div className="why-grid">
          <div className="why-content">
            <h2>Why use Padel Companion?</h2>
            <p>
              We built this because we were tired of managing complex Excel sheets on our phones.
            </p>
            <ul className="why-list">
              <li>
                <strong>Dead simple setup.</strong> You don't need a manual. Just add players, courts, and go.
              </li>
              <li>
                <strong>Works on any device.</strong> iOS, Android, or your laptop. Everyone can track the score from their own phone.
              </li>
              <li>
                <strong>Smart logic.</strong> We handle the uneven numbers, the byes, and the tie-breakers so you don't have to.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section id="workflow" className="tournament-landing__details container">
        <div className="details-card">
          <h2>How it works</h2>
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
