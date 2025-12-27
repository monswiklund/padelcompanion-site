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
    <main className="support-page" style={{ padding: "var(--space-2xl) 0" }}>
      <div className="container">
        <div className="support-header">
          <h1>How Can We Help?</h1>
          <p>
            Find answers to common questions or get in touch with our support
            team.
          </p>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search for answers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>

        <section className="faq-section">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((cat, idx) => (
              <div key={idx} className="faq-category">
                <h3>{cat.category}</h3>
                <div className="faq-list">
                  {cat.items.map((item, iIdx) => (
                    <details key={iIdx} className="faq-item card">
                      <summary>
                        <span>{item.q}</span>
                        <span className="faq-icon">+</span>
                      </summary>
                      <div className="faq-answer">
                        <p>{item.a}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>No results found for "{search}"</p>
            </div>
          )}
        </section>

        <section className="contact-section">
          <div className="contact-container card">
            <div className="contact-info">
              <h3>Still Need Help?</h3>
              <p>
                Our support team is available Monday through Friday to assist
                you.
              </p>
              <div className="contact-methods">
                <div className="method">
                  <span className="icon">✉️</span>
                  <div>
                    <strong>Email Us</strong>
                    <a href="mailto:wiklund.labs@gmail.com">
                      wiklund.labs@gmail.com
                    </a>
                  </div>
                </div>
                <div className="method">
                  <span className="icon">📸</span>
                  <div>
                    <strong>Instagram</strong>
                    <a
                      href="https://www.instagram.com/padelcompanion/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      @padelcompanion
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <form className="contact-form" onSubmit={handleContactSubmit}>
              <h3>Send us a Message</h3>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="your@email.com"
                />
              </div>
              <div className="form-group">
                <label>Subject</label>
                <select
                  required
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                >
                  <option value="" disabled>
                    Select a topic
                  </option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Bug Report">Bug Report</option>
                  <option value="Feature Request">Feature Request</option>
                </select>
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea
                  rows={4}
                  required
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="How can we help?"
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">
                Send Message
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
};

export default SupportPage;
