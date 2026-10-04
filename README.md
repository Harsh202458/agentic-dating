# Agentic Dating Protocol
### Autonomous Dual-Source Matchmaking & Agent-to-Agent Dating Network

[![Live Demo](https://img.shields.io/badge/Live_Demo-GitHub_Pages-rose)](https://harsh202458.github.io/agentic-dating/)
[![Architecture](https://img.shields.io/badge/Architecture-Dual--Source_Agentic-blue)]()
[![Dataset](https://img.shields.io/badge/Verified_Cohort-25_Real_People-emerald)]()

An autonomous dating platform where every individual is represented by a dedicated AI agent. Agents read two and only two public sources—the person's official **LinkedIn** and public **Instagram**—synthesize psychological blueprints, date prospective agents in multi-turn interactive encounters, and generate deterministic, explainable compatibility rankings.

---

## 1. Executive Summary & Core Concept

In traditional dating platforms, humans waste hours swiping on superficial cards and engaging in low-effort small talk. 

**Agentic Dating** reimagines romance through autonomous proxy courtship:
1. **Dual-Source Ingestion**: The system ingests exactly two official links: a person's LinkedIn profile (career, education, intellectual pedigree) and public Instagram profile (lifestyle, visual aesthetics, hobbies).
2. **Strict Grounding (No External Hallucination)**: Zero information is fetched from Google search, Wikipedia, or external databases. If a trait cannot be established from the two public sources, it is explicitly classified as `UNKNOWN`.
3. **Autonomous Dating Lounge**: Rather than relying on simple vector cosine similarities, the agents **actually date each other** across structured multi-turn rounds (Icebreaker, Ambition & Lifestyle Realities, Core Values & Dealbreakers).
4. **Explainable 7-Factor Ranking**: Both agents independently evaluate the encounter, producing a deterministic compatibility quotient based on a weighted 7-factor mathematical formula.

---

## 2. High-Level Architecture

```
[ Official LinkedIn URL ]     [ Public Instagram URL ]
           │                               │
           ▼                               ▼
    [ Apify Scraper ]               [ Apify Scraper ]
(Headline, Roles, Skills)       (Bio, Photos, Hobbies)
           │                               │
           └───────────────┬───────────────┘
                           ▼
               [ Profile Analyzer (Gemini) ]
     ┌─────────────────────┴─────────────────────┐
     ▼                                           ▼
[ Ground Truth ]                         [ Psychological Matrix ]
• Directly Observed Evidence             • Needs & Dealbreakers
• Inferred Traits (with confidence)      • Hobbies & Values
• Explicit Unknowns                      • Agent Persona & Voice
     └─────────────────────┬─────────────────────┘
                           ▼
                [ Autonomous Person Agent ]
                           │
       ┌───────────────────┴───────────────────┐
       ▼                                       ▼
 [ Agent A Proxy ]      ◄─── Multi-Turn ───►  [ Agent B Proxy ]
  (Goal: Protect Person A)       Dating Lounge     (Goal: Protect Person B)
       │                                       │
       ▼                                       ▼
[ Agent A Verdict ]                     [ Agent B Verdict ]
       └───────────────────┬───────────────────┘
                           ▼
            [ 7-Factor Compatibility Engine ]
            • 20% Values Alignment
            • 20% Shared Interests
            • 15% Lifestyle Cadence
            • 15% Relationship Needs
            • 10% Personality Synergy
            • 10% Conversation Dynamic
            • 10% Mutual Agent Verdicts
                           │
                           ▼
          [ Explainable Ranking Leaderboard ]
```

---

## 3. Technology Stack

- **Frontend**: React 18, Vite 6, Tailwind CSS v4, Lucide React, React Router (HashRouter for static GitHub Pages compatibility).
- **Agentic Engine**: Client-side deterministic finite-state courtship engine (`agentEngine.js`) with optional live LLM fallback.
- **Scraping Infrastructure**:
  - `apify/instagram-profile-scraper`: Extracts public bios, media captions, follower statistics, and visual tags.
  - `curious_coder/linkedin-profile-scraper`: Extracts public professional headlines, experience chronologies, and verified competencies.
- **Synthesizer**: Google Gemini 1.5 Flash (`generativelanguage.googleapis.com`) for psychological vector induction.
- **Storage**: Static JSON datasets (`profiles_analyzed.json`, `matches.json`, `rankings.json`) combined with browser `localStorage` for real-time user-added candidates.

---

## 4. How LinkedIn + Instagram Become an Agent

For every individual, information is extracted strictly from the two authorized links:

| Source | Extracted Attributes | Agent Synthesis |
| :--- | :--- | :--- |
| **LinkedIn** | Current role, company history, educational pedigree, professional skills | Intellectual pursuits, career ambition quotient, conflict tolerance |
| **Instagram** | Public bio, follower count, photo themes, sports/travel captions | Lifestyle rituals, daily hobbies, energy levels, aesthetic affinity |

### Taxonomy of Knowledge:
To eliminate AI hallucination, all profile data is organized into three distinct tiers:
1. **`[OBSERVED]` (Ground Truth)**: Verifiable facts directly extracted from the public page (e.g. *Headline: Professor of Neurobiology at Stanford University*, *Followers: 6.1M*).
2. **`[INFERRED]` (Psychological Hypotheses)**: Personality signals derived by the agent with an explicit confidence score (e.g. *Need for Autonomy: 92% confidence based on solo travel & founder roles*).
3. **`[UNKNOWN]` (Excluded Facts)**: Private human dimensions that cannot be ethically or reliably established from public social media (e.g. *Conflict resolution under stress*, *Private finances*, *Domestic cohabitation habits*).

---

## 5. How Agentic Dating Works

The system does not merely compute an abstract cosine similarity score. Two distinct agent instances enter a simulated **Dating Room**:

1. **Round 1: First Impressions & Curiosities (Icebreaker)**
   - Agent A inspects Person B's public signals, formulates an internal reasoning thought, and asks a tailored question.
   - Agent B consults Person B's lifestyle rules, processes Agent A's opening, thinks, and responds in character.
2. **Round 2: Ambitions, Schedules & Daily Reality**
   - The agents probe work-life balance, schedule conflicts, travel cadences, and co-dependency thresholds.
3. **Round 3: Core Values & Dealbreakers**
   - The agents test for mutual red flags, candor versus politeness, and moral axioms.
4. **Independent Agent Verdicts**:
   - Agent A writes an independent evaluation report of Person B (Score / 100, Green flags, Cautions).
   - Agent B writes an independent evaluation report of Person A (Score / 100, Green flags, Cautions).

---

## 6. Ranking Methodology

Rankings are deterministic, explainable, and reproducible. The final compatibility score is calculated using an explicit weighted formula:

$$\text{Compatibility} = 0.20(\text{Values}) + 0.20(\text{Interests}) + 0.15(\text{Lifestyle}) + 0.15(\text{Needs}) + 0.10(\text{Personality}) + 0.10(\text{Conversation}) + 0.10(\text{Verdicts})$$

Every ranked card includes an interactive **"Why?"** breakdown showing the exact mathematical contribution of each dimension.

---

## 7. 25-Person Verified Cohort

The project includes 25 real, globally recognizable individuals with publicly verifiable LinkedIn and Instagram profiles:

1. **Pieter Levels** (Nomad List / Remote OK) — `pieterlevelsnomad` / `levels.io`
2. **Dr. Andrew Huberman** (Stanford / Huberman Lab) — `andrew-huberman` / `hubermanlab`
3. **Lex Fridman** (MIT / Lex Fridman Podcast) — `lexfridman` / `lexfridman`
4. **Gary Vaynerchuk** (VaynerX) — `garyvaynerchuk` / `garyvee`
5. **Tim Ferriss** (Author / The 4-Hour Workweek) — `timferriss` / `timferriss`
6. **Ali Abdaal** (Author / Feel-Good Productivity) — `aliabdaal` / `aliabdaal`
7. **Marie Forleo** (MarieTV / B-School) — `marieforleo` / `marieforleo`
8. **Sahil Bloom** (SRB Holdings / Author) — `sahilbloom` / `sahilbloom`
9. **Justin Kan** (Twitch / Goat Capital) — `justinkan` / `justinkahn`
10. **Alexis Ohanian** (Reddit / 776) — `alexisohanian` / `alexisohanian`
11. **Ankur Warikoo** (Author / Entrepreneur) — `warikoo` / `ankurwarikoo`
12. **Shaan Puri** (My First Million) — `shaanvp` / `shaanvp`
13. **Nikhil Kamath** (Zerodha / True Beacon) — `nikhilkamath1` / `nikhilkamathcio`
14. **Naval Ravikant** (AngelList / Airchat) — `navalravikant` / `naval`
15. **Lenny Rachitsky** (Lenny's Newsletter & Podcast) — `lennyrachitsky` / `lennyrachitsky`
16. **Rand Fishkin** (SparkToro / Moz) — `randfishkin` / `randfish`
17. **Kunal Shah** (CRED) — `kunal-shah-7949171` / `kunalb11`
18. **Tanmay Bhat** (Comedian / Investor) — `tanmaybhat` / `tanmaybhat`
19. **Varun Mayya** (Aeos / Builder) — `varunmayya` / `varunmayya`
20. **Deepika Padukone** (Actor / Live Love Laugh) — `deepikapadukone` / `deepikapadukone`
21. **Priyanka Chopra** (Actor / Producer) — `priyanka-chopra` / `priyankachopra`
22. **Mark Zuckerberg** (Meta) — `mark-zuckerberg-618bba58` / `zuck`
23. **Elon Musk** (Tesla / SpaceX) — `elonmusk` / `elonmusk`
24. **Ratan Tata** (Tata Sons) — `ratan-tata-b1b5b32` / `ratantata`
25. **Sundar Pichai** (Google & Alphabet) — `sundar-pichai-7a255b5` / `sundarpichai`

---

## 8. Local Setup & Execution

### Prerequisites:
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation:
```bash
# Clone the repository
git clone https://github.com/Harsh202458/agentic-dating.git
cd agentic-dating

# Install frontend dependencies
cd frontend
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 9. Environment Variables

Create a `.env` file in `frontend/` (or copy from `.env.example`):

```bash
# Optional: Apify API token for live profile scraping
VITE_APIFY_TOKEN=your_apify_token_here

# Optional: Google Gemini API key for live LLM persona synthesis
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

*Note: The platform is fully operable out-of-the-box using the precomputed dataset and client-side deterministic agentic engine even without external API credits.*

---

## 10. Responsible Use & Public Profile Constraints

1. **Strictly Public Footprints**: The system only processes publicly accessible LinkedIn URLs and publicly visible Instagram accounts. It does not attempt to bypass login walls, private account settings, or access restrictions.
2. **Non-Sensitive Scope**: Analysis is restricted strictly to professional interests, publicly declared hobbies, lifestyle pacing, and high-level values. No protected personal or sensitive attributes are processed.
