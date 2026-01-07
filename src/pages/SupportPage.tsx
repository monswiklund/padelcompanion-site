import React, { useState, useEffect } from "react";

const FAQ_DATA = [
  {
    category: "General",
    items: [
      {
        q: "How do I track a match?",
        a: 'Open the app and tap "New Match" on the home screen. Add the players, select the scoring format, and tap "Start Match". During the match, simply tap the team that won the point to update the score.',
      },
      {
        q: "Can I use the app on my smartwatch?",
        a: "Yes! Padel Companion has fully-featured smartwatch apps for both Apple Watch and Wear OS. You can start matches, track scores, and view statistics directly from your wrist.",
      },
      {
        q: "Can I edit a match after it's finished?",
        a: 'Yes, you can edit the final score, date, and players of any completed match. Go to your "History" tab, select the match you want to modify, and tap the "Edit" button.',
      },
    ],
  },
  {
    category: "Tournaments",
    items: [
      {
        q: "How do I organize an Americano tournament?",
        a: 'Go to "Tournaments" and tap "New Tournament". Select "Americano" as the format, add your players, set the number of courts, and the app will automatically generate the schedule.',
      },
      {
        q: "What is Mexicano format?",
        a: "Mexicano is a dynamic tournament format where pairings change after each round based on the leaderboard. The top players are paired against each other.",
      },
      {
        q: "Can I handle uneven numbers of players?",
        a: 'Absolutely. The tournament engine automatically handles "bye" rounds if you have an uneven number of players (e.g., 5, 9, 13).',
      },
    ],
  },
  {
    category: "Account & Privacy",
    items: [
      {
        q: "Is my data synced across devices?",
        a: "Yes! When you're signed in, your matches and statistics sync automatically across all your devices via iCloud (iOS) or Google Cloud (Android).",
      },
      {
        q: "How do I delete my account?",
        a: 'To delete your account, open the app, go to Settings, scroll to the bottom and tap "Delete Account". This action is permanent.',
      },
    ],
  },
];

const SupportPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Support: ${contactSubject}`);
    const body = encodeURIComponent(
      `Name: ${contactName}\nEmail: ${contactEmail}\n\nMessage:\n${contactMessage}`
    );
    window.location.href = `mailto:wiklund.labs@gmail.com?subject=${subject}&body=${body}`;
  };

  const filteredFaqs = FAQ_DATA.map((cat) => ({
    ...cat,
    items: cat.items.filter(
      (i) =>
        i.q.toLowerCase().includes(search.toLowerCase()) ||
        i.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((cat) => cat.items.length > 0);

  return (
    <main className="py-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            How Can We Help?
          </h1>
          <p className="text-secondary text-lg mb-8">
            Find answers to common questions or get in touch with our support
            team.
          </p>
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search for answers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-card border border-theme rounded-xl px-5 py-3 pr-12 text-primary placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted">
              🔍
            </span>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="mb-16">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((cat, idx) => (
              <div key={idx} className="mb-10">
                <h3 className="text-xl font-semibold text-primary mb-4">
                  {cat.category}
                </h3>
                <div className="space-y-3">
                  {cat.items.map((item, iIdx) => (
                    <details
                      key={iIdx}
                      className="group bg-card border border-theme rounded-xl overflow-hidden"
                    >
                      <summary className="flex items-center justify-between p-4 cursor-pointer text-primary font-medium hover:bg-elevated transition-colors">
                        <span>{item.q}</span>
                        <span className="text-accent text-xl group-open:rotate-45 transition-transform">
                          +
                        </span>
                      </summary>
                      <div className="px-4 pb-4 text-secondary leading-relaxed">
                        <p>{item.a}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted text-lg">
                No results found for "{search}"
              </p>
            </div>
          )}
        </section>

        {/* Contact Section */}
        <section>
          <div className="bg-card border border-theme rounded-2xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              {/* Contact Info */}
              <div className="p-8 bg-elevated">
                <h3 className="text-2xl font-bold text-primary mb-4">
                  Still Need Help?
                </h3>
                <p className="text-secondary mb-8">
                  Our support team is available Monday through Friday to assist
                  you.
                </p>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <span className="text-2xl">✉️</span>
                    <div>
                      <strong className="text-primary block mb-1">
                        Email Us
                      </strong>
                      <a
                        href="mailto:wiklund.labs@gmail.com"
                        className="text-accent hover:text-accent-light transition-colors"
                      >
                        wiklund.labs@gmail.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="text-2xl">📸</span>
                    <div>
                      <strong className="text-primary block mb-1">
                        Instagram
                      </strong>
                      <a
                        href="https://www.instagram.com/padelcompanion/"
                        target="_blank"
                        rel="noreferrer"
                        className="text-accent hover:text-accent-light transition-colors"
                      >
                        @padelcompanion
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <form className="p-8" onSubmit={handleContactSubmit}>
                <h3 className="text-2xl font-bold text-primary mb-6">
                  Send us a Message
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Your name"
                      className="w-full bg-elevated border border-theme rounded-lg px-4 py-3 text-primary placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full bg-elevated border border-theme rounded-lg px-4 py-3 text-primary placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">
                      Subject
                    </label>
                    <select
                      required
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      className="w-full bg-elevated border border-theme rounded-lg px-4 py-3 text-primary focus:outline-none focus:border-accent transition-colors cursor-pointer"
                    >
                      <option value="" disabled>
                        Select a topic
                      </option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Bug Report">Bug Report</option>
                      <option value="Feature Request">Feature Request</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="How can we help?"
                      className="w-full bg-elevated border border-theme rounded-lg px-4 py-3 text-primary placeholder:text-muted focus:outline-none focus:border-accent transition-colors resize-none"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-accent hover:bg-accent-dark text-white font-medium py-3 rounded-xl transition-colors"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default SupportPage;
