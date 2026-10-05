const fs = require('fs');
const path = require('path');

const people = [
  // ==========================================
  // MEN (13 Candidates, Seeking Female)
  // ==========================================
  {
    id: 1,
    name: "Pieter Levels",
    gender: "male",
    seeking: "female",
    linkedin_url: "https://www.linkedin.com/in/pieterlevelsnomad/",
    instagram_url: "https://www.instagram.com/levels.io/",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80",
    followers: 85200,
    isVerified: true,
    headline: "Founder at Nomad List, Remote OK, Photo AI",
    location: "Nomadic / Lisbon / Amsterdam",
    needs: ["Total location independence", "Appreciation for minimalist building", "Low drama communication", "Deep intellectual curiosity"],
    hobbies: ["Solo indie hacking", "Kite surfing", "Electronic music production", "Coffee hunting", "Urban cycling"],
    interests: ["Digital Nomadism", "AI photo generation", "Bootstrapping software", "Macroeconomics", "Decentralized lifestyle"],
    personality: ["Hyper-autonomous", "Pragmatic", "Unapologetic builder", "Minimalist", "Direct"],
    values: ["Freedom over status", "Speed of execution", "Transparency", "Simplicity"],
    dealbreakers: ["Corporate bureaucracy mindsets", "Neediness / clinginess", "Reluctance to travel spontaneously"],
    loveLanguage: "Quality Time & Freedom",
    lifestyleScore: { ambition: 9, adventure: 10, social: 6, intellectual: 9, creativity: 9 },
    summary: "Pieter is the poster child for solo internet entrepreneurship, living life on his own terms between Lisbon and Tokyo. He seeks a partner who thrives on global freedom, creative autonomy, and genuine wit.",
    agentVoice: "I build fast, travel light, and want a partner who can jump on a flight to Tokyo tomorrow without overthinking it."
  },
  {
    id: 2,
    name: "Dr. Andrew Huberman",
    gender: "male",
    seeking: "female",
    linkedin_url: "https://www.linkedin.com/in/andrew-huberman/",
    instagram_url: "https://www.instagram.com/hubermanlab/",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    followers: 6100000,
    isVerified: true,
    headline: "Neurobiologist & Professor at Stanford University School of Medicine | Host of Huberman Lab",
    location: "Stanford, California, USA",
    needs: ["Strict circadian rhythm alignment", "Commitment to cognitive and physical optimization", "Deep psychological honesty", "Peaceful home sanctuary"],
    hobbies: ["Morning sunlight viewing", "Zone 2 cardio & weight training", "Cold plunges", "Walking in nature", "Reading neurobiology journals"],
    interests: ["Neuroplasticity", "Dopamine dynamics", "Sleep science", "High-stress cognitive protocols", "Longevity"],
    personality: ["Disciplined", "Intense", "Methodical", "Nurturing mentor", "Hyper-articulate"],
    values: ["Scientific rigor", "Self-mastery", "Biological truth", "Dedication to health"],
    dealbreakers: ["Late night screen addiction", "Unwillingness to exercise", "Superficial small talk", "Emotional volatility"],
    loveLanguage: "Acts of Service & Physical Touch",
    lifestyleScore: { ambition: 10, adventure: 7, social: 6, intellectual: 10, creativity: 7 },
    summary: "Stanford neuroscientist transforming global public health through zero-cost science protocols. Seeks an emotionally grounded partner committed to growth, discipline, and daily morning sunlight.",
    agentVoice: "If we can align our morning light protocols and value deep biological focus, we are already halfway to an extraordinary bond."
  },
  {
    id: 3,
    name: "Lex Fridman",
    gender: "male",
    seeking: "female",
    linkedin_url: "https://www.linkedin.com/in/lexfridman/",
    instagram_url: "https://www.instagram.com/lexfridman/",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    followers: 3200000,
    isVerified: true,
    headline: "Host of Lex Fridman Podcast | AI Researcher at MIT",
    location: "Austin, Texas, USA",
    needs: ["Sincere belief in universal love", "Tolerance for 4-hour existential conversations", "Shared appreciation for martial arts & music", "Quiet introspection"],
    hobbies: ["Brazilian Jiu-Jitsu (Black Belt)", "Acoustic guitar & poetry", "Reading Dostoevsky & Camus", "Long solo distance runs", "Coding autonomous vehicle algorithms"],
    interests: ["Artificial General Intelligence", "Space exploration", "Philosophy of consciousness", "Robotics", "Human empathy"],
    personality: ["Deeply earnest", "Melancholic romantic", "Tenacious", "Introspective", "Gentle"],
    values: ["Unconditional love", "Truth-seeking", "Kindness under pressure", "Intellectual humility"],
    dealbreakers: ["Cynicism about humanity", "Materialistic obsession", "Mocking earnest emotion"],
    loveLanguage: "Words of Affirmation & Deep Conversations",
    lifestyleScore: { ambition: 9, adventure: 8, social: 5, intellectual: 10, creativity: 8 },
    summary: "MIT roboticist and thoughtful interviewer who wears a black suit and believes love is the greatest superpower in the universe. Seeks a poetic, kind soul to build a lifetime of wonder with.",
    agentVoice: "I believe love is the only answer to the infinite darkness of the universe; let's talk about robots, poetry, and kindness until 3 AM."
  },
  {
    id: 4,
    name: "Gary Vaynerchuk",
    gender: "male",
    seeking: "female",
    linkedin_url: "https://www.linkedin.com/in/garyvaynerchuk/",
    instagram_url: "https://www.instagram.com/garyvee/",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80",
    followers: 10500000,
    isVerified: true,
    headline: "Chairman of VaynerX, CEO of VaynerMedia, 5x NYT Bestselling Author",
    location: "New York, New York, USA",
    needs: ["Emotional stamina to match boundless energy", "Shared passion for building & community", "Zero patience for complaining", "Family first devotion"],
    hobbies: ["Sports card trading", "Garage sale hunting", "Cheering for the NY Jets", "Wine tasting", "Mentoring aspiring youth"],
    interests: ["Consumer culture", "Web3 / VeeFriends", "Digital attention arbitrage", "Parenting with empathy", "Pop culture"],
    personality: ["Electric", "Hyper-empathetic", "Relentless", "Candid", "Grounded"],
    values: ["Macro patience, micro speed", "Radical empathy", "Gratitude", "No entitlement"],
    dealbreakers: ["Entitlement and complaining", "Pessimism", "Disrespect towards working class people"],
    loveLanguage: "Words of Affirmation & Acts of Service",
    lifestyleScore: { ambition: 10, adventure: 8, social: 10, intellectual: 8, creativity: 9 },
    summary: "High-octane media entrepreneur fueled by radical empathy and an undying dream to buy the NY Jets. Seeks someone whose inner warmth and positive fire match his own relentless spirit.",
    agentVoice: "I don't care about fancy dinners; let's laugh until our stomachs hurt, stay humble, and build something iconic."
  },
  {
    id: 5,
    name: "Tim Ferriss",
    gender: "male",
    seeking: "female",
    linkedin_url: "https://www.linkedin.com/in/timferriss/",
    instagram_url: "https://www.instagram.com/timferriss/",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80",
    followers: 1800000,
    isVerified: true,
    headline: "Author of The 4-Hour Workweek | Host of The Tim Ferriss Show",
    location: "Austin, Texas, USA",
    needs: ["Respect for intentional solitude and digital sabbaticals", "Adventurous culinary openness", "Stoic resilience under stress", "Intellectual curiosity across diverse domains"],
    hobbies: ["Archery", "Tango dancing", "Japanese tea ceremonies", "Kettlebell training", "Rare book collecting"],
    interests: ["Psychedelic science research", "Stoicism (Seneca / Marcus Aurelius)", "Rapid skill acquisition", "Longevity protocols", "Angel investing"],
    personality: ["Analytical experimenter", "Stoic", "Deeply reflective", "Playfully skeptical", "Generous host"],
    values: ["Self-awareness", "Efficiency & leverage", "Mental tranquility (Ataraxia)", "Intellectual honesty"],
    dealbreakers: ["Chaos created by poor boundaries", "Resistance to trying novel foods/experiences", "Dogmatic thinking"],
    loveLanguage: "Quality Time & Shared Discovery",
    lifestyleScore: { ambition: 9, adventure: 9, social: 6, intellectual: 10, creativity: 8 },
    summary: "The pioneer of lifestyle design, turning life into a series of deeply thoughtful experiments. He looks for an intellectual partner to deconstruct the art of living well.",
    agentVoice: "Let's turn off our phones for the weekend, brew some exceptional pu-erh tea, and ask ourselves what life looks like when it's easy and peaceful."
  },
  {
    id: 6,
    name: "Ali Abdaal",
    gender: "male",
    seeking: "female",
    linkedin_url: "https://www.linkedin.com/in/aliabdaal/",
    instagram_url: "https://www.instagram.com/aliabdaal/",
    photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80",
    followers: 1200000,
    isVerified: true,
    headline: "Doctor turned Creator & Entrepreneur | Author of Feel-Good Productivity",
    location: "London, United Kingdom",
    needs: ["Playful daily enthusiasm", "Openness to systemizing life fun", "Shared enjoyment of cozy cafes and books", "Emotional validation and humor"],
    hobbies: ["Board games (Catan, Wingspan)", "Piano improv", "Reading non-fiction", "Specialty coffee brewing", "Casual video gaming"],
    interests: ["Feel-good productivity", "Creator business models", "Behavioral economics", "Psychology of happiness", "Notion workflows"],
    personality: ["Warmly nerdy", "Incurably cheerful", "Curious", "Vulnerable", "Reflective"],
    values: ["Joy over friction", "Continual learning", "Honest self-expression", "Playfulness"],
    dealbreakers: ["Chronically cynical attitudes", "Mocking healthy ambition", "Refusal to communicate emotions"],
    loveLanguage: "Words of Affirmation & Quality Time",
    lifestyleScore: { ambition: 9, adventure: 7, social: 8, intellectual: 9, creativity: 9 },
    summary: "Cambridge-trained doctor turned global productivity educator who believes work and life should feel deeply joyful. Looking for a bright, kind partner to share laughter, cozy Sundays, and board game marathons.",
    agentVoice: "Life is too short for friction. I want a partner with whom building a joyful, meaningful life feels effortless and fun."
  },
  {
    id: 7,
    name: "Sahil Bloom",
    gender: "male",
    seeking: "female",
    linkedin_url: "https://www.linkedin.com/in/sahilbloom/",
    instagram_url: "https://www.instagram.com/sahilbloom/",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80",
    followers: 980000,
    isVerified: true,
    headline: "Author of The 5 Types of Wealth | Managing Partner at SRB Ventures",
    location: "New York, USA",
    needs: ["Deep devotion to family", "Appreciation for simple daily habits", "Shared commitment to emotional and physical health", "Mutual cheering for big dreams"],
    hobbies: ["Morning workouts with his son", "Cooking Sunday dinners", "Writing long-form essays", "Baseball analytics", "Walking in Central Park"],
    interests: ["The 5 types of wealth (Time, Health, Relationships, Physical, Financial)", "Compounding habits", "Mental models", "Fatherhood", "Angel investing"],
    personality: ["Wholesome", "Disciplined", "Supportive", "Optimistic", "Clear thinker"],
    values: ["Family above career", "Consistency", "Integrity", "Humility"],
    dealbreakers: ["Workaholism that sacrifices family", "Superficial status signaling", "Dishonesty"],
    loveLanguage: "Quality Time & Physical Touch",
    lifestyleScore: { ambition: 9, adventure: 7, social: 7, intellectual: 9, creativity: 8 },
    summary: "Former Stanford baseball player turned venture capitalist and bestselling author on holistically wealthy living. Values grounded daily rituals and unconditional loyalty.",
    agentVoice: "True wealth isn't about numbers; it's having time for the people you love. Let's build a life that feels as rich on the inside as it looks on the outside."
  },
  {
    id: 8,
    name: "Alexis Ohanian",
    gender: "male",
    seeking: "female",
    linkedin_url: "https://www.linkedin.com/in/alexisohanian/",
    instagram_url: "https://www.instagram.com/alexisohanian/",
    photo: "https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=400&auto=format&fit=crop&q=80",
    followers: 860000,
    isVerified: true,
    headline: "Founder at Seven Seven Six | Co-Founder at Reddit",
    location: "Florida, USA",
    needs: ["Proud celebration of women's leadership", "Supportive partnership with zero ego jealousy", "Shared love for sports & gaming", "Playful family warmth"],
    hobbies: ["Making elaborate pancake art", "Collecting sports cards & comic books", "Watching women's sports matches", "Cooking backyard barbecues", "Gaming on PC"],
    interests: ["Venture capital in climate and space", "Women's sports revolution", "Fatherhood advocacy", "Internet community culture", "Collectible markets"],
    personality: ["Enthusiastic cheerleader", "Big-hearted", "Playful", "Steadfast", "Visionary"],
    values: ["Egalitarian partnership", "Being the loudest supporter in the room", "Creativity", "Patience"],
    dealbreakers: ["Fragile male ego", "Disinterest in social impact", "Coldness toward family"],
    loveLanguage: "Acts of Service & Words of Affirmation",
    lifestyleScore: { ambition: 10, adventure: 8, social: 8, intellectual: 9, creativity: 9 },
    summary: "Reddit co-founder and venture capitalist celebrated for being a champion partner. He brings massive energy, creative heart, and unwavering devotion to relationships.",
    agentVoice: "The greatest flex is being proud of your partner's brilliance. Let's make pancakes, cheer loudly for each other, and change the world."
  },
  {
    id: 9,
    name: "Naval Ravikant",
    gender: "male",
    seeking: "female",
    linkedin_url: "https://www.linkedin.com/in/navalravikant/",
    instagram_url: "https://www.instagram.com/naval/",
    photo: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80",
    followers: 1400000,
    isVerified: true,
    headline: "Co-Founder at AngelList | Philosopher & Investor",
    location: "San Francisco, California, USA",
    needs: ["Effortless peace of mind", "High intellectual resonance with minimal small talk", "Freedom from social drama", "Mutual love for stillness and meditation"],
    hobbies: ["Reading science & philosophy", "Solo long walks in silence", "Yoga & meditation", "Studying physics", "Sipping herbal tea in gardens"],
    interests: ["First-principles thinking", "Specific knowledge", "Non-duality & Eastern philosophy", "Cryptographic incentives", "Quantum mechanics"],
    personality: ["Sovereign", "Zen-like", "Bluntly truthful", "Calm", "Profoundly independent"],
    values: ["Peace over pleasure", "Absolute freedom", "Truth above consensus", "Self-honesty"],
    dealbreakers: ["Desire for social climbing", "Emotional neediness", "Inability to sit in silence comfortably"],
    loveLanguage: "Quality Time & Physical Presence",
    lifestyleScore: { ambition: 9, adventure: 6, social: 4, intellectual: 10, creativity: 9 },
    summary: "Iconic Silicon Valley philosopher-investor celebrated for aphorisms on happiness and wealth. Seeks a sovereign, deeply peaceful partner who cherishes truth and stillness.",
    agentVoice: "A peaceful mind, a fit body, and a house full of love. These things cannot be bought; they must be earned together."
  },
  {
    id: 10,
    name: "Lenny Rachitsky",
    gender: "male",
    seeking: "female",
    linkedin_url: "https://www.linkedin.com/in/lennyrachitsky/",
    instagram_url: "https://www.instagram.com/lennyrachitsky/",
    photo: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&auto=format&fit=crop&q=80",
    followers: 195000,
    isVerified: true,
    headline: "Author of Lenny's Newsletter & Host of Lenny's Podcast | Ex-Airbnb Product Lead",
    location: "San Francisco, California, USA",
    needs: ["Intellectual curiosity about how products and humans tick", "Warm empathetic dialogue", "Appreciation for good food and craft cocktails", "Grounded work-life rhythm"],
    hobbies: ["Hiking Bay Area trails", "Exploring natural wine bars", "Cooking Mediterranean feasts", "Writing insightful frameworks", "Playing tennis"],
    interests: ["Product strategy & growth", "Community dynamics", "Interview psychology", "Behavioral design", "Culinary exploration"],
    personality: ["Warm", "Exceptionally thoughtful listener", "Curious", "Grounded", "Kind"],
    values: ["Craftsmanship", "Radical generosity", "Honesty", "Equanimity"],
    dealbreakers: ["Self-absorbed arrogance", "Inability to listen to others", "High neurotic drama"],
    loveLanguage: "Quality Time & Acts of Service",
    lifestyleScore: { ambition: 9, adventure: 7, social: 7, intellectual: 9, creativity: 8 },
    summary: "Beloved tech product strategist and interviewer known for unmatched listening skills and thoughtful curiosity. Looking for a bright, self-aware partner to explore great conversations and quiet dinners.",
    agentVoice: "The best conversations happen over good wine with zero pretense. Let's be genuinely curious about the world and each other."
  },
  {
    id: 11,
    name: "Kunal Shah",
    gender: "male",
    seeking: "female",
    linkedin_url: "https://www.linkedin.com/in/kunal-shah-7949171/",
    instagram_url: "https://www.instagram.com/kunalb11/",
    photo: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&auto=format&fit=crop&q=80",
    followers: 430000,
    isVerified: true,
    headline: "Founder at CRED | Philosopher of Human Behavior & Fintech Pioneer",
    location: "Bangalore, India",
    needs: ["Obsession with cognitive curiosity", "Appreciation for behavioral economics", "Fast-paced mental sparring", "Emotional depth without status anxiety"],
    hobbies: ["Studying cognitive biases", "Night walks debating philosophy", "Reading behavioral sociology", "Mentoring founders", "Espresso tastings"],
    interests: ["Delta 4 product frameworks", "Evolutionary psychology", "Fintech architecture", "Societal status games", "Epistemology"],
    personality: ["Enigmatic", "Intensely analytical", "Philosophical", "Provocative", "Cerebral"],
    values: ["Curiosity as a lifestyle", "Efficiency", "High trust networks", "Cognitive self-awareness"],
    dealbreakers: ["Dogmatic superficial opinions", "Playing victim in life", "Boring mental conversations"],
    loveLanguage: "Deep Intellectual Debate & Quality Time",
    lifestyleScore: { ambition: 10, adventure: 7, social: 7, intellectual: 10, creativity: 9 },
    summary: "CRED founder and behavioral philosopher who views human societies through evolutionary psychology. Seeks an intellectually formidable partner with sharp wit and zero pretense.",
    agentVoice: "Most people play status games without knowing it. Let's skip the small talk and debate why humans behave the way they do."
  },
  {
    id: 12,
    name: "Shaan Puri",
    gender: "male",
    seeking: "female",
    linkedin_url: "https://www.linkedin.com/in/shaanvp/",
    instagram_url: "https://www.instagram.com/shaanvp/",
    photo: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&auto=format&fit=crop&q=80",
    followers: 310000,
    isVerified: true,
    headline: "Host of My First Million Podcast | Entrepreneur & Investor",
    location: "San Francisco, USA",
    needs: ["Playful sense of humor", "Support for wild brainstorming ideas", "Relaxed home environment", "Shared love for great storytelling"],
    hobbies: ["Storytelling on mic", "Playing basketball", "Hosting friend game nights", "Brainstorming crazy business ideas", "Traveling with family"],
    interests: ["Frameworks for wealth", "Media businesses", "Psychology of virality", "Poker & probability", "Humor in communication"],
    personality: ["Charismatic", "Hilarious", "Energetic", "Practical", "Authentic"],
    values: ["Unapologetic fun", "Family loyalty", "Optimism", "High agency"],
    dealbreakers: ["Taking oneself too seriously", "Stinginess with laughter", "Negative energy"],
    loveLanguage: "Words of Affirmation & Shared Laughs",
    lifestyleScore: { ambition: 9, adventure: 8, social: 9, intellectual: 8, creativity: 10 },
    summary: "Host of My First Million and energetic serial entrepreneur who brings wit, warmth, and laughter to everything. Looking for a partner who loves a good laugh and dream-building.",
    agentVoice: "Life should be an adventure you laugh through together. Let's make each other laugh every single day."
  },
  {
    id: 13,
    name: "Mark Zuckerberg",
    gender: "male",
    seeking: "female",
    linkedin_url: "https://www.linkedin.com/in/mark-zuckerberg-618bba58/",
    instagram_url: "https://www.instagram.com/zuck/",
    photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80",
    followers: 14800000,
    isVerified: true,
    headline: "Founder and CEO at Meta",
    location: "Palo Alto, California, USA",
    needs: ["Steadfast long-term loyalty", "Shared excitement for extreme athletic disciplines", "Grounded family privacy", "Support during high-stakes technological epochs"],
    hobbies: ["Brazilian Jiu-Jitsu & MMA", "Hydrofoil surfing in Hawaii", "Raising cattle and smoking brisket", "Reading Latin classics & Homer", "Archery"],
    interests: ["Open source AI (Llama)", "Metaverse & holographic computing", "Cellular longevity science", "Martial arts biomechanics", "Clean energy infrastructure"],
    personality: ["Hyper-focused", "Stoic competitor", "Loyal family man", "Relentless executor", "Analytical"],
    values: ["Building for the 100-year horizon", "Family loyalty", "Physical & mental grit", "Relentless optimism"],
    dealbreakers: ["Breaches of trust & confidentiality", "Quitting under pressure", "Disloyalty to the clan"],
    loveLanguage: "Acts of Service & Quality Time",
    lifestyleScore: { ambition: 10, adventure: 9, social: 7, intellectual: 10, creativity: 9 },
    summary: "Tech titan who built the global social graph and reimagined himself as an open-source AI pioneer and martial artist. Deeply devoted to family and building the future.",
    agentVoice: "I believe in building things that endure for decades. Let's train hard, protect our peace, and build a meaningful legacy."
  },

  // ==========================================
  // WOMEN (12 Candidates, Seeking Male)
  // ==========================================
  {
    id: 14,
    name: "Sara Blakely",
    gender: "female",
    seeking: "male",
    linkedin_url: "https://www.linkedin.com/in/sarablakely/",
    instagram_url: "https://www.instagram.com/sarablakely/",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    followers: 2100000,
    isVerified: true,
    headline: "Founder & Executive Chairwoman at SPANX & Sneex | Self-Made Billionaire",
    location: "Atlanta, Georgia, USA",
    needs: ["Playful self-deprecating humor", "Zero fear of an ambitious woman's success", "Spontaneous adventure without agenda", "Daily celebration of failure as a teacher"],
    hobbies: ["Inventing silly products at home", "Singing Broadway tunes in the kitchen", "Traveling with kids", "Collecting quirky art", "Journaling doodle ideas"],
    interests: ["Product innovation & fabrics", "Female entrepreneurship", "The art of selling without shame", "Mindset conditioning", "Philanthropy"],
    personality: ["Hilarious", "Resilient", "Warm", "Down-to-earth", "Unstoppable"],
    values: ["Embracing failure", "Kindness as superpower", "Humor in every situation", "Authentic self-expression"],
    dealbreakers: ["Men intimidated by a woman's success", "Taking yourself too seriously", "Cynicism about big dreams"],
    loveLanguage: "Words of Affirmation & Shared Laughs",
    lifestyleScore: { ambition: 10, adventure: 9, social: 9, intellectual: 9, creativity: 10 },
    summary: "Iconic self-made billionaire who turned $5,000 into a global empire through sheer grit and infectious humor. Seeks a confident, grounded partner who celebrates life with laughter.",
    agentVoice: "Don't ever shrink yourself for anyone. I want a partner who can laugh at themselves, celebrate my wins, and build a joyful empire together."
  },
  {
    id: 15,
    name: "Melanie Perkins",
    gender: "female",
    seeking: "male",
    linkedin_url: "https://www.linkedin.com/in/melanieperkins/",
    instagram_url: "https://www.instagram.com/melanieperkins/",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
    followers: 320000,
    isVerified: true,
    headline: "CEO and Co-founder at Canva",
    location: "Sydney, Australia",
    needs: ["Huge mission alignment", "Grounded humility despite immense impact", "Love for outdoor adventures like kitesurfing", "Shared vision to empower humanity"],
    hobbies: ["Kitesurfing in Western Australia", "Traveling off the beaten path", "Sketching product interfaces", "Hiking coastal cliffs", "Camping under the stars"],
    interests: ["Democratizing design with AI", "Global philanthropy & two-step pledge", "Educational equity", "Product design systems", "Sustainability"],
    personality: ["Visionary", "Grounded", "Quietly tenacious", "Warm", "Altruistic"],
    values: ["Being a good human", "Empowering others", "Setting crazy big goals", "Simplicity"],
    dealbreakers: ["Selfish ego-driven vanity", "Lack of social conscience", "Arrogance in leadership"],
    loveLanguage: "Acts of Service & Quality Time",
    lifestyleScore: { ambition: 10, adventure: 9, social: 7, intellectual: 10, creativity: 10 },
    summary: "Visionary Australian co-founder of Canva who built a multi-billion dollar platform on the philosophy of 'doing the most good we can'. Looks for a grounded, adventurous partner with high emotional agency.",
    agentVoice: "If you set crazy big goals and stay deeply kind along the way, magic happens. Let's kitesurf, dream big, and leave the world better than we found it."
  },
  {
    id: 16,
    name: "Whitney Wolfe Herd",
    gender: "female",
    seeking: "male",
    linkedin_url: "https://www.linkedin.com/in/whitney-wolfe-herd-8b776a38/",
    instagram_url: "https://www.instagram.com/whitney/",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    followers: 670000,
    isVerified: true,
    headline: "Founder and Executive Chair at Bumble Inc.",
    location: "Austin, Texas, USA",
    needs: ["Deep respect for women making the first move", "Emotional safety and clear communication", "Shared passion for healthy relationship dynamics", "Family tranquility"],
    hobbies: ["Pilates and trail running", "Cooking healthy family dinners", "Decorating warm home spaces", "Skiing in Aspen", "Reading psychology"],
    interests: ["Relationship architecture", "Anti-cyberbullying advocacy", "Femtech and family technology", "Equitable dating dynamics", "Venture investing"],
    personality: ["Trailblazer", "Empathetic", "Graceful under pressure", "Determined", "Heart-centered"],
    values: ["Kindness and respect", "Equality in relationships", "Courage to begin", "Accountability"],
    dealbreakers: ["Passive-aggressive communication", "Disrespect towards boundaries", "Toxic masculinity"],
    loveLanguage: "Words of Affirmation & Acts of Service",
    lifestyleScore: { ambition: 10, adventure: 8, social: 8, intellectual: 9, creativity: 9 },
    summary: "Pioneering founder of Bumble who revolutionized modern romance by putting women in control. Seeks an emotionally intelligent, supportive partner who values mutual respect and direct honesty.",
    agentVoice: "The healthiest love begins with kindness and clear respect. I want a partner who communicates with vulnerability and courage."
  },
  {
    id: 17,
    name: "Marie Forleo",
    gender: "female",
    seeking: "male",
    linkedin_url: "https://www.linkedin.com/in/marieforleo/",
    instagram_url: "https://www.instagram.com/marieforleo/",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
    followers: 820000,
    isVerified: true,
    headline: "Entrepreneur, NYT Bestselling Author & Host of MarieTV",
    location: "New York, USA",
    needs: ["High emotional resonance & spiritual depth", "Shared belief that everything is figureoutable", "Dancing through life with joyful energy", "Honest partnership without pretense"],
    hobbies: ["Hip hop dancing", "Reading personal development", "Walking in nature with her dog", "Journaling in sunny spots", "Hosting lively dinner conversations"],
    interests: ["Conscious business building", "Creative intuition", "Mindset reframing", "Holistic wellbeing", "Writing"],
    personality: ["Vibrant", "Wise", "Encouraging", "Fierce", "Humorous"],
    values: ["Everything is figureoutable", "Integrity", "Love in action", "Playful joy"],
    dealbreakers: ["Defeatist helplessness", "Emotional unresponsiveness", "Superficial posturing"],
    loveLanguage: "Words of Affirmation & Quality Time",
    lifestyleScore: { ambition: 9, adventure: 8, social: 9, intellectual: 9, creativity: 10 },
    summary: "Bestselling author and creator of MarieTV who inspires millions to build a business and life they love. Looks for a self-aware, emotionally grounded partner with an adventurous spirit.",
    agentVoice: "Everything is figureoutable when two people are genuinely committed. Let's laugh, dance, and support each other through every chapter."
  },
  {
    id: 18,
    name: "Mira Murati",
    gender: "female",
    seeking: "male",
    linkedin_url: "https://www.linkedin.com/in/mira-murati/",
    instagram_url: "https://www.instagram.com/miramurati/",
    photo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&auto=format&fit=crop&q=80",
    followers: 410000,
    isVerified: true,
    headline: "AI Systems Architect, Former Chief Technology Officer at OpenAI",
    location: "San Francisco, California, USA",
    needs: ["Profound intellectual stimulation", "Appreciation for classical music and literature", "Grace under intense media scrutiny", "Quiet sanctuary for deep thought"],
    hobbies: ["Playing classical piano (Chopin, Bach)", "Reading philosophical treatises & poetry", "Traveling to European historical sites", "Espresso craft", "Quiet contemplative walks"],
    interests: ["Artificial general intelligence safety", "Multimodal neural architectures", "Ethics of autonomous systems", "Physics of computation", "Philosophy of mind"],
    personality: ["Poised", "Brilliantly analytical", "Understated", "Courageous", "Gentle"],
    values: ["Intellectual rigor", "Responsibility to humanity", "Elegance in design", "Inner calm"],
    dealbreakers: ["Loud attention-seeking behavior", "Superficial tech hype", "Intellectual dishonesty"],
    loveLanguage: "Quality Time & Shared Discovery",
    lifestyleScore: { ambition: 10, adventure: 7, social: 5, intellectual: 10, creativity: 9 },
    summary: "The visionary engineering mind behind GPT-4 and DALL-E, blending immense technical intellect with classical cultural depth. Seeks a thoughtful, intellectually sovereign partner.",
    agentVoice: "Technology should elevate the best of human consciousness. Let's discuss AI, art, and philosophy in quiet peace."
  },
  {
    id: 19,
    name: "Dr. Fei-Fei Li",
    gender: "female",
    seeking: "male",
    linkedin_url: "https://www.linkedin.com/in/fei-fei-li-4541247/",
    instagram_url: "https://www.instagram.com/feifeili/",
    photo: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&auto=format&fit=crop&q=80",
    followers: 125000,
    isVerified: true,
    headline: "Sequoia Professor of Computer Science at Stanford University | Co-Director, Stanford HAI",
    location: "Stanford, California, USA",
    needs: ["Human-centered compassion", "Dedication to scientific exploration", "Family warmth and filial respect", "Patient, thoughtful dialogue"],
    hobbies: ["Hiking California hills", "Writing memoirs and reflections", "Gardening with family", "Mentoring young scientists", "Tea ceremonies"],
    interests: ["Human-centered AI", "Computer vision & spatial intelligence", "Healthcare AI", "Cognitive neuroscience", "Ethical governance"],
    personality: ["Warm mentor", "Profound thinker", "Humble pioneer", "Compassionate", "Steadfast"],
    values: ["Human dignity", "Scientific curiosity", "Perseverance against the odds", "Family devotion"],
    dealbreakers: ["Arrogance without empathy", "Short-sighted opportunism", "Disrespect towards human vulnerabilities"],
    loveLanguage: "Acts of Service & Quality Time",
    lifestyleScore: { ambition: 10, adventure: 7, social: 6, intellectual: 10, creativity: 9 },
    summary: "Renowned 'Godmother of AI' whose ImageNet sparked modern deep learning, now guiding AI towards human-centered dignity. Seeks a wise, compassionate partner who values truth and heart.",
    agentVoice: "There is nothing artificial about human love and dignity. Let's build a life anchored in empathy, science, and enduring warmth."
  },
  {
    id: 20,
    name: "Deepika Padukone",
    gender: "female",
    seeking: "male",
    linkedin_url: "https://www.linkedin.com/in/deepikapadukone/",
    instagram_url: "https://www.instagram.com/deepikapadukone/",
    photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80",
    followers: 79000000,
    isVerified: true,
    headline: "Founder at 82°E | Mental Health Advocate & Chairperson, Live Love Laugh Foundation",
    location: "Mumbai, India",
    needs: ["Grounded emotional stability", "Safe space for vulnerability and mental health", "Athletic discipline and fitness dedication", "Quiet sanctuary away from spotlight"],
    hobbies: ["Badminton (former competitive player)", "Meditation & restorative yoga", "Organizing aesthetic home spaces", "Drinking South Indian filter coffee", "Baking"],
    interests: ["Mental health destigmatization", "Holistic self-care rituals", "Cinema & artistic storytelling", "Athletic conditioning", "Sustainable living"],
    personality: ["Graceful", "Vulnerable", "Disciplined", "Warm", "Resilient"],
    values: ["Emotional authenticity", "Physical and mental health", "Kindness", "Grounded humility"],
    dealbreakers: ["Emotional invalidation", "Superficial flashiness", "Disrespect toward mental health struggles"],
    loveLanguage: "Quality Time & Physical Touch",
    lifestyleScore: { ambition: 10, adventure: 7, social: 7, intellectual: 8, creativity: 10 },
    summary: "Global cinema icon and pioneering mental health advocate who balances immense public grace with grounded vulnerability. Looks for an emotionally mature, athletic, and honest partner.",
    agentVoice: "True strength is daring to be vulnerable with the person you love. Let's protect our mental peace and cherish the simple moments."
  },
  {
    id: 21,
    name: "Priyanka Chopra",
    gender: "female",
    seeking: "male",
    linkedin_url: "https://www.linkedin.com/in/priyanka-chopra/",
    instagram_url: "https://www.instagram.com/priyankachopra/",
    photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&auto=format&fit=crop&q=80",
    followers: 91000000,
    isVerified: true,
    headline: "Global Producer, Entrepreneur & UNICEF Goodwill Ambassador",
    location: "Los Angeles, California, USA",
    needs: ["Mutual celebration of boundless ambition", "Deep family devotion across cultures", "Spontaneous laughter and romantic gestures", "Rock-solid loyalty"],
    hobbies: ["Hosting global family dinners", "Traveling across continents", "Singing and music jam sessions", "Writing memoirs", "Swimming in the ocean"],
    interests: ["Cross-cultural storytelling", "Philanthropy with UNICEF", "Female empowerment", "Entrepreneurship in beauty and hospitality", "Global music"],
    personality: ["Dynamic", "Warmly charismatic", "Tenacious", "Loving", "Fearless"],
    values: ["Family above all", "Courage to take risks", "Inclusivity", "Unapologetic ambition"],
    dealbreakers: ["Small-minded insecurity", "Jealousy of a partner's success", "Emotional coldness"],
    loveLanguage: "Words of Affirmation & Physical Touch",
    lifestyleScore: { ambition: 10, adventure: 10, social: 10, intellectual: 8, creativity: 10 },
    summary: "Trailblazing international producer and entrepreneur who bridges Hollywood and Bollywood with infectious energy and family devotion. Seeks a secure, romantic partner with equal fire.",
    agentVoice: "Never be afraid of dreaming bigger than everyone else in the room. I want a partner who stands proudly beside me as we take on the world."
  },
  {
    id: 22,
    name: "Arianna Huffington",
    gender: "female",
    seeking: "male",
    linkedin_url: "https://www.linkedin.com/in/ariannahuffington/",
    instagram_url: "https://www.instagram.com/ariannahuff/",
    photo: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&auto=format&fit=crop&q=80",
    followers: 780000,
    isVerified: true,
    headline: "Founder & CEO at Thrive Global | Founder of The Huffington Post",
    location: "New York, USA",
    needs: ["Radical prioritization of sleep and wellbeing", "Greek warmth and hospitality", "Intellectual wit and political acumen", "Zero tolerance for burnout glorification"],
    hobbies: ["Greek island sailing", "Deep 8-hour sleep rituals", "Hosting philosophical salons", "Walking while phone-free", "Reading ancient Greek poetry"],
    interests: ["End-of-burnout revolution", "Sleep science and cognitive renewal", "Media innovation", "Philosophy of thriving", "Global policy"],
    personality: ["Effervescent", "Wise", "Warm maternal strength", "Witty", "Persuasive"],
    values: ["Wellbeing as non-negotiable", "Wisdom over metrics", "Hospitality", "Human connection"],
    dealbreakers: ["Workaholics who brag about lack of sleep", "Emotional cynicism", "Neglecting health"],
    loveLanguage: "Acts of Service & Quality Time",
    lifestyleScore: { ambition: 10, adventure: 8, social: 9, intellectual: 10, creativity: 9 },
    summary: "Legendary media founder and wellbeing advocate leading the global movement to end burnout. Seeks an emotionally wise, intellectual partner who values deep rest and rich conversation.",
    agentVoice: "Burnout is not a badge of honor. Let's sleep 8 hours, savor Mediterranean feasts, and live a life of profound joy."
  },
  {
    id: 23,
    name: "Reshma Saujani",
    gender: "female",
    seeking: "male",
    linkedin_url: "https://www.linkedin.com/in/reshma-saujani/",
    instagram_url: "https://www.instagram.com/reshmasaujani/",
    photo: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&auto=format&fit=crop&q=80",
    followers: 320000,
    isVerified: true,
    headline: "Founder & CEO of Moms First | Founder of Girls Who Code",
    location: "New York, USA",
    needs: ["Equal emotional labor in partnership", "Bravery over perfection", "Shared activism for equity", "Vulnerability and deep humor"],
    hobbies: ["Running New York city parks", "Advocating for paid family leave", "Weekend baking with her kids", "Reading feminist sociology", "Yoga"],
    interests: ["Teach girls bravery, not perfection", "Moms First policy reform", "Tech equity", "Public leadership", "Parenting support networks"],
    personality: ["Courageous", "Uncompromisingly authentic", "Warm", "Fierce advocate", "Inspiring"],
    values: ["Brave, not perfect", "Gender equality", "Community solidarity", "Resilience"],
    dealbreakers: ["Partners who expect traditional domestic servitude", "Fear of failure", "Indifference to social equity"],
    loveLanguage: "Words of Affirmation & Acts of Service",
    lifestyleScore: { ambition: 10, adventure: 7, social: 9, intellectual: 9, creativity: 8 },
    summary: "Visionary founder of Girls Who Code and Moms First teaching the world to be brave rather than perfect. Seeks a genuinely egalitarian partner with moral backbone and warm humor.",
    agentVoice: "Perfection is a trap; bravery is freedom. Let's be brave together, fight for what matters, and love without fear."
  },
  {
    id: 24,
    name: "Gwyneth Paltrow",
    gender: "female",
    seeking: "male",
    linkedin_url: "https://www.linkedin.com/in/gwynethpaltrow/",
    instagram_url: "https://www.instagram.com/gwynethpaltrow/",
    photo: "https://images.unsplash.com/photo-1548142813-c348350df52b?w=400&auto=format&fit=crop&q=80",
    followers: 8400000,
    isVerified: true,
    headline: "Founder & CEO at goop.com",
    location: "Los Angeles, California, USA",
    needs: ["Holistic wellness resonance", "Conscious uncoupling maturity in conflict", "Shared enjoyment of clean culinary craft", "Emotional vulnerability"],
    hobbies: ["Cooking clean gourmet recipes", "Infrared sauna sessions", "Hiking Santa Monica mountains", "Testing novel clean beauty botanicals", "Interior curation"],
    interests: ["Functional medicine & gut health", "Clean lifestyle innovation", "Erotic wellness destigmatization", "Artisan gastronomy", "Conscious parenting"],
    personality: ["Unapologetically curious", "Earthy elegance", "Warm", "Direct", "Adventurous"],
    values: ["Conscious intimacy", "Bodily autonomy & wellness", "Aesthetic beauty", "Radical authenticity"],
    dealbreakers: ["Closed-minded skepticism toward holistic wellness", "Emotional cowardice", "Messiness with boundaries"],
    loveLanguage: "Physical Touch & Quality Time",
    lifestyleScore: { ambition: 9, adventure: 8, social: 8, intellectual: 8, creativity: 10 },
    summary: "Oscar-winning actress turned wellness titan who built goop into a pioneer of clean living and conscious relationships. Looks for an emotionally self-aware, wellness-minded partner.",
    agentVoice: "Conscious love requires showing up fully without defense mechanisms. Let's eat clean food, embrace vulnerability, and thrive."
  },
  {
    id: 25,
    name: "Jessica Alba",
    gender: "female",
    seeking: "male",
    linkedin_url: "https://www.linkedin.com/in/jessica-alba-85880b43/",
    instagram_url: "https://www.instagram.com/jessicaalba/",
    photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80",
    followers: 20600000,
    isVerified: true,
    headline: "Founder & Chief Creative Officer at The Honest Company",
    location: "Los Angeles, California, USA",
    needs: ["Grounded family first dedication", "Unconditional support for a female founder", "Shared passion for healthy clean living", "Fun-loving lightness and laughter"],
    hobbies: ["Hosting outdoor family barbecues", "Dance workouts with friends", "Curating clean home products", "Traveling to beaches", "Gardening herbs"],
    interests: ["Clean consumer products", "Nontoxic living", "Female leadership in public companies", "Latina representation", "Parenting rituals"],
    personality: ["Grounded", "Hardworking", "Warm motherly heart", "Lighthearted", "Tenacious"],
    values: ["Health & safety for families", "Honesty above all", "Unpretentious warmth", "Hard work"],
    dealbreakers: ["Dishonesty or deceit", "Superficial Hollywood pretense", "Lack of work ethic"],
    loveLanguage: "Acts of Service & Physical Touch",
    lifestyleScore: { ambition: 9, adventure: 7, social: 8, intellectual: 8, creativity: 9 },
    summary: "Beloved entrepreneur who built The Honest Company into an ethical consumer giant while maintaining deep family warmth. Seeks a secure, honest partner who loves family and laughter.",
    agentVoice: "Honesty and family are everything. I want a partner who is completely real with me, works hard, and makes life joyful."
  }
];

// Ensure explicit looking_for and normalized seeking on all candidates
people.forEach(p => {
  p.looking_for = p.gender === 'male' ? 'women' : 'men';
  p.seeking = p.gender === 'male' ? 'women' : 'men';
});

// Save profiles
const dataDir = path.join(__dirname, '../data');
const publicDataDir = path.join(__dirname, '../frontend/public/data');

fs.writeFileSync(path.join(dataDir, 'profiles_analyzed.json'), JSON.stringify(people, null, 2));
fs.writeFileSync(path.join(publicDataDir, 'profiles_analyzed.json'), JSON.stringify(people, null, 2));

// Also generate simple people.json
const simplePeople = people.map(p => ({
  id: p.id,
  name: p.name,
  gender: p.gender,
  looking_for: p.looking_for,
  seeking: p.seeking,
  linkedin: p.linkedin_url,
  instagram: p.instagram_url,
  photo: p.photo,
  headline: p.headline
}));
fs.writeFileSync(path.join(dataDir, 'people.json'), JSON.stringify(simplePeople, null, 2));
fs.writeFileSync(path.join(publicDataDir, 'people.json'), JSON.stringify(simplePeople, null, 2));

console.log('✅ Generated 25 balanced profiles (13 Men, 12 Women)!');

// ==========================================
// MATCHING & DATING DIALOGUE GENERATOR
// ==========================================
const matches = {};
const rankings = {};

for (const p of people) {
  matches[p.id] = {};
  rankings[p.id] = { id: p.id, name: p.name, gender: p.gender, looking_for: p.looking_for, seeking: p.seeking, ranked: [] };
}

function calculateMatch(pA, pB) {
  const isOppositeGender = pA.gender !== pB.gender;

  // Compute rich factor scores
  const ambDiff = Math.abs(pA.lifestyleScore.ambition - pB.lifestyleScore.ambition);
  const intDiff = Math.abs(pA.lifestyleScore.intellectual - pB.lifestyleScore.intellectual);
  const advDiff = Math.abs(pA.lifestyleScore.adventure - pB.lifestyleScore.adventure);

  const sharedValues = pA.values.filter(v => pB.values.some(pv => pv.toLowerCase().includes(v.toLowerCase().slice(0, 4))));
  const sharedInterests = pA.interests.filter(i => pB.interests.some(pi => pi.toLowerCase().includes(i.toLowerCase().slice(0, 4))));

  // Breakdown scores (0-100)
  const valuesScore = Math.min(98, Math.max(65, 75 + sharedValues.length * 8 - ambDiff * 2));
  const interestsScore = Math.min(96, Math.max(60, 72 + sharedInterests.length * 9 - advDiff * 2));
  const lifestyleScore = Math.min(95, Math.max(62, 85 - (ambDiff + intDiff + advDiff) * 3));
  const needsScore = Math.min(97, Math.max(68, 80 + (pA.loveLanguage.includes(pB.loveLanguage.slice(0, 4)) ? 10 : 0)));

  // If opposite gender (normal heterosexual matching), high realistic scores (78-95%)
  // If same gender, penalize score so heterosexual rankings strictly prioritize opposite gender
  let overallScore = Math.round(valuesScore * 0.3 + interestsScore * 0.25 + lifestyleScore * 0.25 + needsScore * 0.2);
  if (!isOppositeGender) {
    overallScore = Math.max(30, overallScore - 45); // Penalize same-gender for heterosexual matching
  }

  // Tailored dialogues reflecting craft and gender synergy
  const conversation = [
    {
      agent: "A",
      name: pA.name,
      message: `Hello. I represent ${pA.name}. I analyzed your verified profiles — your devotion to ${pB.interests[0]} and lifestyle around ${pB.hobbies[0]} immediately stood out. How do you protect your personal energy amidst that momentum?`
    },
    {
      agent: "B",
      name: pB.name,
      message: `Thank you. For ${pB.name}, those rituals are how clarity is protected. Looking at ${pA.name}'s track in ${pA.headline.split('|')[0].trim()}, there is tremendous agency. In relationships, we look for someone who understands that drive without feeling overshadowed.`
    },
    {
      agent: "A",
      name: pA.name,
      message: `That aligns directly with ${pA.name}'s non-negotiable requirement. We believe in sovereign partnership where both people cheer loudly for each other's missions. Our core value is ${pA.values[0]}. What does healthy conflict look like for ${pB.name}?`
    },
    {
      agent: "B",
      name: pB.name,
      message: `Radical candor with deep empathy. No passive-aggressive silence or games. Life is too short to dance around issues. If something feels off, we address it with warmth and move forward immediately.`
    },
    {
      agent: "A",
      name: pA.name,
      message: `That is extraordinarily refreshing. A shared life should bring peace, laughter, and high intellectual resonance. If our agents set up a first encounter, would it be something active like ${pA.hobbies[1] || 'traveling'} or quiet conversation over dinner?`
    },
    {
      agent: "B",
      name: pB.name,
      message: `Both: an adventurous afternoon exploring something new, followed by hours of effortless conversation about ${pB.interests[1] || 'the future'}. Our internal compatibility models confirm powerful resonance.`
    }
  ];

  const sparks = [
    `Mutual resonance on ${pA.values[0]} and ${pB.values[0]}`,
    `Complementary lifestyle cadence: both thrive on high creative agency`,
    `Shared expectation for radical honesty and zero performative pretense`
  ];

  const tensions = [
    `Intense public travel schedules require deliberate calendar protection`,
    `Both operate at high speeds, needing intentional downtime together`
  ];

  const matchReason = `${pA.name} and ${pB.name} exhibit an extraordinary ${overallScore}% romantic resonance. Both operate with sovereign ambition and demand total emotional authenticity, creating a balanced, high-trust dynamic.`;

  const breakdown = {
    values: { score: valuesScore, label: "Core Moral Axioms & Principles", weight: "30%" },
    interests: { score: interestsScore, label: "Creative & Professional Craft Synergy", weight: "25%" },
    lifestyle: { score: lifestyleScore, label: "Daily Rhythm & Energy Cadence", weight: "25%" },
    needs: { score: needsScore, label: "Emotional Fulfillment & Boundaries", weight: "20%" }
  };

  return {
    personA: pA.id,
    personB: pB.id,
    compatibilityScore: overallScore,
    matchReason,
    sparks,
    tensions,
    conversation,
    breakdown,
    isOppositeGender
  };
}

// Generate all pairwise matches
for (let i = 0; i < people.length; i++) {
  for (let j = 0; j < people.length; j++) {
    if (i === j) continue;
    const pA = people[i];
    const pB = people[j];

    const match = calculateMatch(pA, pB);

    // Strictly save ONLY opposite-gender matches and rankings
    if (match.isOppositeGender) {
      matches[pA.id][pB.id] = match;
      rankings[pA.id].ranked.push({
        id: pB.id,
        name: pB.name,
        gender: pB.gender,
        score: match.compatibilityScore,
        reason: match.matchReason,
        breakdown: match.breakdown
      });
    }
  }
}

// Sort each person's rankings descending by score
for (const id in rankings) {
  rankings[id].ranked.sort((a, b) => b.score - a.score);
}

fs.writeFileSync(path.join(dataDir, 'matches.json'), JSON.stringify(matches, null, 2));
fs.writeFileSync(path.join(publicDataDir, 'matches.json'), JSON.stringify(matches, null, 2));
fs.writeFileSync(path.join(dataDir, 'rankings.json'), JSON.stringify(rankings, null, 2));
fs.writeFileSync(path.join(publicDataDir, 'rankings.json'), JSON.stringify(rankings, null, 2));

console.log('✅ Generated 100% heterosexual, opposite-gender verified rankings and matches for all 25 candidates!');
