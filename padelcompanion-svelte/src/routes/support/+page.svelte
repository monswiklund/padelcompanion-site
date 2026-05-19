<script lang="ts">
  import { onMount } from "svelte";
  import { slide } from "svelte/transition";
  import Icons from "$lib/components/Icons.svelte";
  import { Select } from "bits-ui";

  const SUBJECT_OPTIONS = [
    { value: "General Inquiry", label: "General Inquiry" },
    { value: "Bug Report", label: "Bug Report" },
    { value: "Feature Request", label: "Feature Request" },
  ];

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

  let search = $state("");
  let contactName = $state("");
  let contactEmail = $state("");
  let contactSubject = $state("");
  let contactMessage = $state("");

  // Track open detail items (so we can close others or style properly)
  let openItems = $state<Record<string, boolean>>({});

  function toggleItem(key: string) {
    openItems[key] = !openItems[key];
  }

  // Reactive filtered FAQs
  let filteredFaqs = $derived.by(() => {
    return FAQ_DATA.map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (i) =>
          i.q.toLowerCase().includes(search.toLowerCase()) ||
          i.a.toLowerCase().includes(search.toLowerCase())
      ),
    })).filter((cat) => cat.items.length > 0);
  });

  function handleContactSubmit(e: Event) {
    e.preventDefault();
    const subject = encodeURIComponent(`Support: ${contactSubject}`);
    const body = encodeURIComponent(
      `Name: ${contactName}\nEmail: ${contactEmail}\n\nMessage:\n${contactMessage}`
    );
    window.location.href = `mailto:wiklund.labs@gmail.com?subject=${subject}&body=${body}`;
  }

  onMount(() => {
    window.scrollTo(0, 0);
  });
</script>

<main class="py-24 min-h-screen">
  <div class="max-w-4xl mx-auto px-6">
    <!-- Header -->
    <div class="text-center mb-16 animate-fade-in-up">
      <h1 class="text-4xl md:text-6xl font-black text-foreground mb-6 font-display">
        How Can We Help?
      </h1>
      <p class="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
        Find answers to common questions or get in touch with our support team.
      </p>
      
      <!-- Search Input -->
      <div class="relative max-w-md mx-auto">
        <input
          type="text"
          placeholder="Search for answers..."
          bind:value={search}
          class="w-full bg-card border border-border rounded-full px-6 py-3.5 pr-12 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors shadow-inner"
        />
        <span class="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground flex items-center">
          <Icons name="search" size={18} />
        </span>
      </div>
    </div>

    <!-- FAQ Section -->
    <section class="mb-20">
      {#if filteredFaqs.length > 0}
        {#each filteredFaqs as cat, catIdx}
          <div class="mb-10 animate-fade-in">
            <h3 class="text-xl font-black text-foreground mb-4 uppercase tracking-wider font-display text-accent-light">
              {cat.category}
            </h3>
            
            <div class="space-y-3">
              {#each cat.items as item, itemIdx}
                {@const itemKey = `${catIdx}-${itemIdx}`}
                <div class="bg-card border border-border rounded-2xl overflow-hidden transition-all duration-300">
                  <button
                    onclick={() => toggleItem(itemKey)}
                    class="w-full text-left flex items-center justify-between p-5 cursor-pointer text-foreground font-semibold hover:bg-popover transition-colors border-0 bg-transparent font-display text-base"
                  >
                    <span>{item.q}</span>
                    <span
                      class="text-accent text-xl transition-transform duration-300 select-none"
                      style="transform: rotate({openItems[itemKey] ? '45deg' : '0deg'})"
                    >
                      +
                    </span>
                  </button>
                  
                  {#if openItems[itemKey]}
                    <div
                      transition:slide={{ duration: 250 }}
                      class="px-5 pb-5 text-muted-foreground leading-relaxed text-[0.95rem] border-t border-border/10 pt-3"
                    >
                      <p>{item.a}</p>
                    </div>
                  {/if}
                </div>
              {/each}
            </div>
          </div>
        {/each}
      {:else}
        <div class="text-center py-12 animate-fade-in">
          <p class="text-muted-foreground text-lg">
            No results found for "{search}"
          </p>
        </div>
      {/if}
    </section>

    <!-- Contact Section -->
    <section class="animate-fade-in-up">
      <div class="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div class="grid md:grid-cols-2">
          
          <!-- Contact Info -->
          <div class="p-8 md:p-12 bg-popover/50 flex flex-col justify-between">
            <div>
              <h3 class="text-3xl font-black text-foreground mb-4 font-display">
                Still Need Help?
              </h3>
              <p class="text-muted-foreground mb-12">
                Our support team is available Monday through Friday to assist you.
              </p>
            </div>
            
            <div class="space-y-8">
              <div class="flex items-start gap-4">
                <span class="text-2xl text-accent flex items-center mt-1"><Icons name="cloud" size={24} /></span>
                <div>
                  <strong class="text-foreground block mb-1 font-display">
                    Email Us
                  </strong>
                  <a
                    href="mailto:wiklund.labs@gmail.com"
                    class="text-accent hover:text-accent-light transition-colors font-semibold"
                  >
                    wiklund.labs@gmail.com
                  </a>
                </div>
              </div>
              
              <div class="flex items-start gap-4">
                <span class="text-2xl text-accent flex items-center mt-1"><Icons name="globe" size={24} /></span>
                <div>
                  <strong class="text-foreground block mb-1 font-display">
                    Instagram
                  </strong>
                  <a
                    href="https://www.instagram.com/padelcompanion/"
                    target="_blank"
                    rel="noreferrer"
                    class="text-accent hover:text-accent-light transition-colors font-semibold"
                  >
                    @padelcompanion
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Form -->
          <form class="p-8 md:p-12 border-t md:border-t-0 md:border-l border-border" onsubmit={handleContactSubmit}>
            <h3 class="text-2xl font-black text-foreground mb-6 font-display">
              Send us a Message
            </h3>
            
            <div class="space-y-4">
              <div>
                <label for="contact-name" class="block text-xs uppercase tracking-wider font-bold text-muted-foreground mb-2">
                  Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  bind:value={contactName}
                  placeholder="Your name"
                  class="w-full bg-popover border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors"
                />
              </div>

              <div>
                <label for="contact-email" class="block text-xs uppercase tracking-wider font-bold text-muted-foreground mb-2">
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  bind:value={contactEmail}
                  placeholder="your@email.com"
                  class="w-full bg-popover border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors"
                />
              </div>

              <div>
                <span id="contact-subject-label" class="block text-xs uppercase tracking-wider font-bold text-muted-foreground mb-2">
                  Subject
                </span>
                <Select.Root type="single" bind:value={contactSubject} required>
                  <Select.Trigger
                    class="w-full bg-popover border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-colors cursor-pointer flex items-center justify-between"
                    aria-labelledby="contact-subject-label"
                  >
                    {SUBJECT_OPTIONS.find((o) => o.value === contactSubject)?.label ?? "Select a topic"}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content class="z-[1001] bg-popover border border-border rounded-xl shadow-2xl p-1 min-w-[var(--bits-select-anchor-width)]" sideOffset={4}>
                      <Select.Viewport>
                        {#each SUBJECT_OPTIONS as o}
                          <Select.Item value={o.value} label={o.label} class="px-3 py-2 text-foreground data-[highlighted]:bg-accent/10 rounded-lg cursor-pointer outline-none transition-colors">
                            {o.label}
                          </Select.Item>
                        {/each}
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </div>

              <div>
                <label for="contact-message" class="block text-xs uppercase tracking-wider font-bold text-muted-foreground mb-2">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows="4"
                  required
                  bind:value={contactMessage}
                  placeholder="How can we help?"
                  class="w-full bg-popover border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors resize-none"
                ></textarea>
              </div>
              
              <button
                type="submit"
                class="w-full bg-accent hover:bg-accent-dark text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover-glow cursor-pointer border-0"
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
