const fs = require('fs');
const path = require('path');

const people = [
  {
    id: 1,
    name: "Pieter Levels",
    linkedin_url: "https://www.linkedin.com/in/pieterlevelsnomad/",
    instagram_url: "https://www.instagram.com/levels.io/",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
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
    linkedin_url: "https://www.linkedin.com/in/andrew-huberman/",
    instagram_url: "https://www.instagram.com/hubermanlab/",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    followers: 6100000,
    isVerified: true,
    headline: "Neurobiologist & Professor at Stanford University School of Medicine | Host of Huberman Lab",
    location: "Stanford, California, USA",
    needs: ["Strict circadian rhythm alignment", "Commitment to cognitive and physical optimization", "Deep psychological honesty", "Peaceful home sanctuary"],
    hobbies: ["Morning sunlight viewing", "Zone 2 cardio & weight training", "Cold plunges", "Walking his bulldog Costello (in memory)", "Reading neurobiology journals"],
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
    linkedin_url: "https://www.linkedin.com/in/lexfridman/",
    instagram_url: "https://www.instagram.com/lexfridman/",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    followers: 3200000,
    isVerified: true,
    headline: "Host of Lex Fridman Podcast | AI Researcher at MIT",
    location: "Austin, Texas, USA",
    needs: ["Sincere belief in the power of universal love", "Tolerance for 4-hour existential conversations", "Shared appreciation for Brazilian Jiu-Jitsu", "Quiet introspection"],
    hobbies: ["Brazilian Jiu-Jitsu (Black Belt)", "Acoustic guitar & Russian poetry", "Reading Dostoevsky & Camus", "Long solo distance runs", "Coding autonomous vehicle algorithms"],
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
    linkedin_url: "https://www.linkedin.com/in/garyvaynerchuk/",
    instagram_url: "https://www.instagram.com/garyvee/",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80",
    followers: 10500000,
    isVerified: true,
    headline: "Chairman of VaynerX, CEO of VaynerMedia, 5x NYT Bestselling Author",
    location: "New York, New York, USA",
    needs: ["Emotional stamina to match boundless energy", "Shared passion for garage sale hunting and business hustle", "Zero patience for complaining", "Family first devotion"],
    hobbies: ["Sports card trading", "Flipping garage sale treasures", "Cheering for the NY Jets", "Wine tasting", "Mentoring aspiring youth"],
    interests: ["Consumer culture", "Web3 / VeeFriends", "Digital attention arbitrage", "Parenting with empathy", "Pop culture"],
    personality: ["Electric", "Hyper-empathetic", "Relentless", "Candid", "Grounded"],
    values: ["Macro patience, micro speed", "Radical empathy", "Gratitude", "No entitlement"],
    dealbreakers: ["Entitlement and complaining", "Pessimism", "Disrespect towards working class people"],
    loveLanguage: "Words of Affirmation & Acts of Service",
    lifestyleScore: { ambition: 10, adventure: 8, social: 10, intellectual: 8, creativity: 9 },
    summary: "High-octane media entrepreneur fueled by radical empathy and an undying dream to buy the NY Jets. Seeks someone whose inner warmth and positive fire match his own relentless spirit.",
    agentVoice: "I don't care about fancy dinners; let's go hit garage sales at 6 AM, laugh until our stomachs hurt, and build something iconic."
  },
  {
    id: 5,
    name: "Tim Ferriss",
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
    summary: "The ultimate human guinea pig and pioneer of lifestyle design, turning life into a series of deeply thoughtful experiments. He looks for a partner to deconstruct the art of living well.",
    agentVoice: "Let's turn off our phones for the weekend, brew some exceptional pu-erh tea, and ask ourselves what life looks like when it's easy and peaceful."
  },
  {
    id: 6,
    name: "Ali Abdaal",
    linkedin_url: "https://www.linkedin.com/in/aliabdaal/",
    instagram_url: "https://www.instagram.com/aliabdaal/",
    photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80",
    followers: 1200000,
    isVerified: true,
    headline: "Doctor turned Creator & Entrepreneur | Author of Feel-Good Productivity",
    location: "London, United Kingdom",
    needs: ["Playful daily enthusiasm", "Openness to systemizing life fun", "Shared enjoyment of cozy cafes and books", "Emotional validation and humor"],
    hobbies: ["Board game nights (Catan, Avalon)", "Playing piano & singing musical theatre", "Reading non-fiction at cafes", "Badminton", "Stationery curation"],
    interests: ["Feel-good productivity", "Notion workflows", "Behavioral economics", "Storytelling", "Camaraderie"],
    personality: ["Warm", "Whimsical", "Highly systematic", "Optimistic", "Vulnerable"],
    values: ["Joy over friction", "Lifelong learning", "Kindness", "Sincere curiosity"],
    dealbreakers: ["Gloomy cynicism", "Lack of intellectual banter", "Dislike of board games"],
    loveLanguage: "Words of Affirmation & Quality Time",
    lifestyleScore: { ambition: 9, adventure: 7, social: 8, intellectual: 9, creativity: 8 },
    summary: "Cambridge-trained doctor turned global creator championing joy-driven productivity. He brings infectious sunshine, smart systems, and warm tea to every single day.",
    agentVoice: "Life should feel like play, not a grind; let's find a sunlit London bookstore and talk about our wildest creative dreams."
  },
  {
    id: 7,
    name: "Marie Forleo",
    linkedin_url: "https://www.linkedin.com/in/marieforleo/",
    instagram_url: "https://www.instagram.com/marieforleo/",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    followers: 800000,
    isVerified: true,
    headline: "#1 NYT Bestselling Author of 'Everything is Figureoutable' | Host of MarieTV",
    location: "New York & Los Angeles, USA",
    needs: ["A partner with their own thriving purpose", "Willingness to dance in the living room", "Unshakable growth mindset", "Deep mutual loyalty"],
    hobbies: ["Hip hop dance classes", "Creative cooking", "Interior design styling", "Beach walks with her rescue dog Kuma", "Writing by hand"],
    interests: ["Female empowerment", "Creative entrepreneurship", "Mindset coaching", "Philanthropy (Pencils of Promise)", "Spiritual wellness"],
    personality: ["Radiant", "Spitfire comedic timing", "Fiercely loving", "Relentlessly encouraging", "Savvy"],
    values: ["Everything is figureoutable", "Generosity", "Soulful integrity", "Laughter"],
    dealbreakers: ["Victim mentality", "Inability to laugh at oneself", "Lack of ambition"],
    loveLanguage: "Words of Affirmation & Quality Time",
    lifestyleScore: { ambition: 9, adventure: 8, social: 9, intellectual: 8, creativity: 10 },
    summary: "Oprah-anointed thought leader and dance enthusiast who proves that heart and hustle can conquer anything. Looking for a conscious, joyful partner with big dreams and zero excuses.",
    agentVoice: "Never forget: everything is figureoutable, especially love. Bring your whole authentic self to the table."
  },
  {
    id: 8,
    name: "Sahil Bloom",
    linkedin_url: "https://www.linkedin.com/in/sahilbloom/",
    instagram_url: "https://www.instagram.com/sahilbloom/",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80",
    followers: 650000,
    isVerified: true,
    headline: "Managing Partner at SRB Ventures | Author of The 5 Types of Wealth",
    location: "New York, USA",
    needs: ["Shared commitment to family centricity", "Early morning workout buddy energy", "Long walks without phones", "Mutual intellectual sharpening"],
    hobbies: ["Baseball (former Stanford pitcher)", "Rucking & barbell training", "Sunset walks with his son and dog", "Writing newsletters", "Coffee brewing rituals"],
    interests: ["The 5 types of wealth (Time, Health, Relationships, Physical, Financial)", "Mental models", "Stoic parenting", "Compounding effects", "Angel investing"],
    personality: ["Grounded", "High integrity", "Clear-headed", "Disciplined", "Devoted family man"],
    values: ["Compound growth in relationships", "Physical vitality", "Time sovereignty", "Uncompromising presence"],
    dealbreakers: ["Obsession with vanity status over real substance", "Neglect of physical health", "Disloyalty"],
    loveLanguage: "Acts of Service & Physical Touch",
    lifestyleScore: { ambition: 9, adventure: 7, social: 7, intellectual: 9, creativity: 8 },
    summary: "Ex-Stanford athlete and venture investor exploring the true meaning of rich relationships and time wealth. He lives by first principles and treasures deep emotional anchors.",
    agentVoice: "Real wealth is having control over your time and spending it with people who make your soul feel light."
  },
  {
    id: 9,
    name: "Justin Kan",
    linkedin_url: "https://www.linkedin.com/in/justinkan/",
    instagram_url: "https://www.instagram.com/justinkahn/",
    photo: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80",
    followers: 240000,
    isVerified: true,
    headline: "Co-founder at Twitch | General Partner at Goat Capital",
    location: "San Francisco, California, USA",
    needs: ["Spiritual depth and vulnerability", "Freedom from tech hype superficiality", "Outdoor wilderness connection", "Meditation companion"],
    hobbies: ["Vipassana meditation retreats", "Surfing & ocean swimming", "Trail running", "Tea tasting", "Somatic breathwork"],
    interests: ["Inner peace after immense success", "Mental health de-stigmatization", "Community living", "Philosophy of self", "Regenerative agriculture"],
    personality: ["Self-aware", "Zen-seeking", "Playfully chaotic past, grounded present", "Humble", "Insightful"],
    values: ["Presence over ego", "Radical authenticity", "Compassion", "Joyful simplicity"],
    dealbreakers: ["Social climbing / clout chasing", "Alcohol-centric partying", "Emotional superficiality"],
    loveLanguage: "Quality Time & Physical Touch",
    lifestyleScore: { ambition: 8, adventure: 9, social: 7, intellectual: 9, creativity: 8 },
    summary: "Twitch founder who made hundreds of millions, realized money doesn't buy happiness, and embarked on a profound inner journey. Seeks someone ready for real emotional and spiritual depth.",
    agentVoice: "I sold a company for a billion dollars and discovered the only thing that matters is love, presence, and riding waves at sunrise."
  },
  {
    id: 10,
    name: "Alexis Ohanian",
    linkedin_url: "https://www.linkedin.com/in/alexisohanian/",
    instagram_url: "https://www.instagram.com/alexisohanian/",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80",
    followers: 850000,
    isVerified: true,
    headline: "Founder at Seven Seven Six | Co-founder of Reddit",
    location: "Florida & Los Angeles, USA",
    needs: ["Fierce champion of women's sports and female ambition", "Pancake art mornings with family", "Geeky collector spirit", "Big generational thinking"],
    hobbies: ["Sunday pancake art", "Trading card collecting (WNBA / Marvel)", "Gaming & tech gadgets", "Tennis cheering section", "Waffle making"],
    interests: ["Angel City FC / Women's sports equity", "Climate tech ventures", "Fatherhood advocacy (paid family leave)", "Internet culture history", "Space exploration"],
    personality: ["Enthusiastic dad-energy", "Visionary operator", "Loyal spouse champion", "Warm-hearted geek", "Bold"],
    values: ["Family above all", "Equality and amplification of women", "Integrity", "Joyful craft"],
    dealbreakers: ["Disrespecting women's sports", "Cold cynicism towards geek culture", "Inability to celebrate a partner's success"],
    loveLanguage: "Acts of Service & Words of Affirmation",
    lifestyleScore: { ambition: 9, adventure: 8, social: 8, intellectual: 9, creativity: 9 },
    summary: "Reddit co-founder and venture capitalist celebrated for being his partner's number-one hype man and a tireless champion for equality. He brings playful warmth and giant vision.",
    agentVoice: "I take immense pride in being the loudest cheerleader for the person I love while we build businesses that change the world."
  },
  {
    id: 11,
    name: "Ankur Warikoo",
    linkedin_url: "https://www.linkedin.com/in/warikoo/",
    instagram_url: "https://www.instagram.com/ankurwarikoo/",
    photo: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80",
    followers: 2800000,
    isVerified: true,
    headline: "Entrepreneur, Content Creator & Bestselling Author ('Do Epic Shit')",
    location: "New Delhi, India",
    needs: ["Openness to documenting life learnings", "Financial discipline and transparency", "Emotional self-regulation", "Regular philosophical retrospectives"],
    hobbies: ["Journaling every morning", "Reading autobiographies", "Public speaking", "Mentoring first-gen college students", "Walking 10,000 steps"],
    interests: ["Personal finance for youth", "Failure retrospectives", "Habit formation", "Consumer behavior", "Indian startup ecosystem"],
    personality: ["Reflective teacher", "Methodical", "Transparent about failure", "Calm", "Empathetic listener"],
    values: ["Self-awareness", "Radical transparency", "Financial peace", "Continuous improvement"],
    dealbreakers: ["Living beyond one's means to impress strangers", "Hiding mistakes", "Apathy towards personal growth"],
    loveLanguage: "Words of Affirmation & Acts of Service",
    lifestyleScore: { ambition: 8, adventure: 6, social: 8, intellectual: 9, creativity: 8 },
    summary: "One of India's most beloved mentors, famous for breaking down complex life questions with brutal vulnerability and clear wisdom. Seeks someone who values emotional and financial sanity.",
    agentVoice: "Failure is not the opposite of success; it's a part of it. Let's build a calm, honest life together where we learn from everything."
  },
  {
    id: 12,
    name: "Shaan Puri",
    linkedin_url: "https://www.linkedin.com/in/shaanvp/",
    instagram_url: "https://www.instagram.com/shaanvp/",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80",
    followers: 180000,
    isVerified: true,
    headline: "Host of My First Million Podcast | Investor & Serial Entrepreneur",
    location: "San Francisco, California, USA",
    needs: ["A sparring partner for crazy business brainstorming", "High banter and teasing tolerance", "Appreciation for comfort and luxury travel", "Fast decision-making"],
    hobbies: ["Brainstorming billion-dollar napkin ideas", "Host of dinner parties with eclectic thinkers", "Squash & basketball", "Poker nights", "Reading odd history trivia"],
    interests: ["My First Million podcasting", "Viral copywriting", "Ecommerce rollups", "Psychology of winning", "Storytelling frameworks"],
    personality: ["Charismatic storyteller", "Cheeky", "High agency", "Entertaining", "Fast-thinking"],
    values: ["Agency (figuring things out)", "Humor and lightness", "Abundance mindset", "Loyalty to friends"],
    dealbreakers: ["Low energy / wet blanket vibes", "Passive-aggressive hints", "Being slow to make decisions"],
    loveLanguage: "Quality Time & Gift Giving",
    lifestyleScore: { ambition: 9, adventure: 8, social: 10, intellectual: 8, creativity: 10 },
    summary: "Co-host of the internet's favorite business podcast, bursting with infectious charisma, lightning-speed ideas, and high-stakes optimism. Never a boring second.",
    agentVoice: "I want someone who can roast me at dinner, brainstorm a wild business idea at midnight, and turn every ordinary Tuesday into an adventure."
  },
  {
    id: 13,
    name: "Nikhil Kamath",
    linkedin_url: "https://www.linkedin.com/in/nikhilkamath1/",
    instagram_url: "https://www.instagram.com/nikhilkamathcio/",
    photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80",
    followers: 1400000,
    isVerified: true,
    headline: "Co-founder at Zerodha & True Beacon | Host of 'WTF is' Podcast",
    location: "Bangalore, India",
    needs: ["Intellectual independence across geopolitics and markets", "Chess games with high stakes banter", "Shared passion for philanthropy (Giving Pledge)", "Unconventional worldviews"],
    hobbies: ["Competitive chess", "Weightlifting & fitness", "Hosting roundtables on macro trends", "Reading historical non-fiction", "Rooftop acoustic sessions"],
    interests: ["Financial democratization", "Young India philanthropic ventures", "Global macroeconomic shifts", "Philosophy of happiness", "Art investing"],
    personality: ["Sharp thinker", "Maverick", "Unconventional", "Grounded despite billions", "Curious contrarian"],
    values: ["Contrarian thinking", "First-principles logic", "Giving back", "Meritocracy"],
    dealbreakers: ["Dogmatic adherence to conventional scripts", "Pretentious social posturing", "Lack of intellectual stamina"],
    loveLanguage: "Quality Time & Deep Dialogue",
    lifestyleScore: { ambition: 10, adventure: 8, social: 7, intellectual: 10, creativity: 8 },
    summary: "Self-taught trading prodigy who built India's biggest stock brokerage without venture capital, now tackling macro issues on his viral roundtables. Seeks a sharp, independent mind.",
    agentVoice: "Let's skip the small talk. Sit across the chessboard and let's debate where the world will be twenty years from now."
  },
  {
    id: 14,
    name: "Naval Ravikant",
    linkedin_url: "https://www.linkedin.com/in/navalravikant/",
    instagram_url: "https://www.instagram.com/naval/",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
    followers: 600000,
    isVerified: true,
    headline: "Co-founder of AngelList | Philosopher & Investor",
    location: "San Francisco, California, USA",
    needs: ["Peace and quiet above all else", "Zero calendar appointments", "Philosophical resonance on mindfulness and freedom", "Uncluttered living"],
    hobbies: ["Yoga and breathing exercises", "Reading ancient Greek and Indian philosophy", "Walking in nature with zero devices", "Writing aphorisms", "Observing thoughts"],
    interests: ["Specific knowledge & permissionless leverage", "Freedom from desires", "Quantum physics interpretations", "Cryptography", "Epistemology (David Deutsch)"],
    personality: ["Zen sage", "Clarity-obsessed", "Independent thinker", "Serene", "Uncompromising on peace"],
    values: ["Inner peace over wealth", "Truth over comfort", "Radical autonomy", "Desirelessness"],
    dealbreakers: ["Jealousy and possessiveness", "Constant scheduled busyness", "Living to impress others"],
    loveLanguage: "Quality Time & Peaceful Presence",
    lifestyleScore: { ambition: 8, adventure: 7, social: 4, intellectual: 10, creativity: 9 },
    summary: "The Silicon Valley philosopher who unlocked the code to modern wealth and discovered that ultimate success is an untroubled, joyful mind. Looking for serene, unhurried companionship.",
    agentVoice: "A happy person isn't someone in a particular set of circumstances, but rather a person with a particular set of attitudes. Peace is happiness at rest."
  },
  {
    id: 15,
    name: "Lenny Rachitsky",
    linkedin_url: "https://www.linkedin.com/in/lennyrachitsky/",
    instagram_url: "https://www.instagram.com/lennyrachitsky/",
    photo: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&auto=format&fit=crop&q=80",
    followers: 120000,
    isVerified: true,
    headline: "Author of Lenny's Newsletter & Host of Lenny's Podcast | Ex-Airbnb Growth Lead",
    location: "San Francisco, California, USA",
    needs: ["Thoughtful and low-ego presence", "Appreciation for craftsmanship in writing and food", "Empathy and emotional curiosity", "Shared love for quiet city strolls"],
    hobbies: ["Exploring hidden neighborhood bakeries", "Collecting vinyl records", "Podcasting with startup leaders", "Hiking in Marin County", "Cooking Italian dishes"],
    interests: ["Product management craft", "Community building dynamics", "Interview psychology", "Human habits", "Venture strategy"],
    personality: ["Exceptionally humble", "Empathetic listener", "Craftsman", "Gentle", "Methodical"],
    values: ["Service to others", "Craftsmanship", "Humility", "Curiosity"],
    dealbreakers: ["Arrogance or ego-tripping", "Interrupting others constantly", "Superficial transactional relationships"],
    loveLanguage: "Quality Time & Acts of Service",
    lifestyleScore: { ambition: 8, adventure: 7, social: 7, intellectual: 9, creativity: 8 },
    summary: "The internet's top product thinker whose superpower is asking the right question and listening with 100% presence. He brings quiet warmth, intellectual depth, and artisanal taste.",
    agentVoice: "I care about the details — how people treat baristas, how stories unfold, and how we make each other feel heard."
  },
  {
    id: 16,
    name: "Rand Fishkin",
    linkedin_url: "https://www.linkedin.com/in/randfishkin/",
    instagram_url: "https://www.instagram.com/randfish/",
    photo: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80",
    followers: 75000,
    isVerified: true,
    headline: "Co-founder & CEO at SparkToro | Author of 'Lost and Founder'",
    location: "Seattle, Washington, USA",
    needs: ["A partner who loves food, travel, and honest conversations about mental health", "Deep support for progressive values and feminist principles", "Zero tolerance for startup hustle toxicity"],
    hobbies: ["Cocktail mixology", "Tabletop gaming & RPGs", "Pasta making from scratch", "Traveling across Europe by train", "Writing honest memoir reflections"],
    interests: ["Audience research", "Challenging venture capital dogmas", "Mental health transparency in tech", "Culinary traditions", "Indie business resilience"],
    personality: ["Deeply vulnerable", "Principles-first", "Culinary aficionado", "Kind-hearted rebel", "Loyal"],
    values: ["Transparency at all costs", "Feminism and equality", "Kindness over growth", "Emotional honesty"],
    dealbreakers: ["Toxic hustle culture bragging", "Lack of social empathy", "Bigotry of any kind"],
    loveLanguage: "Acts of Service & Quality Time",
    lifestyleScore: { ambition: 8, adventure: 8, social: 7, intellectual: 9, creativity: 9 },
    summary: "Beloved tech founder with a magnificent mustache, celebrated for blowing the whistle on Silicon Valley hype and sharing authentic struggles. Seeks a compassionate, foodie soul.",
    agentVoice: "Let's make pasta from scratch, drink a craft cocktail, and talk openly about our vulnerabilities without any masks."
  },
  {
    id: 17,
    name: "Kunal Shah",
    linkedin_url: "https://www.linkedin.com/in/kunal-shah-7949171/",
    instagram_url: "https://www.instagram.com/kunalb11/",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    followers: 550000,
    isVerified: true,
    headline: "Founder at CRED | Philosophy Graduate turned Fintech Titan",
    location: "Bangalore & Mumbai, India",
    needs: ["A partner fascinated by evolutionary psychology and status games", "Tolerance for late night philosophy debates", "Appreciation for sleek aesthetics and design excellence"],
    hobbies: ["Evolutionary psychology research", "Designing luxury user experiences", "Deep midnight phone conversations", "Angel investing in 200+ founders", "Philosophy reading"],
    interests: ["Delta 4 product theory", "Trust frameworks in society", "Status and human motivations", "Fintech evolution", "Cognitive biases"],
    personality: ["Enigmatic", "Philosophical provocateur", "Aesthetic perfectionist", "Deep thinker", "Uniquely perceptive"],
    values: ["High trust ecosystems", "First principles analysis of human behavior", "Aesthetic beauty", "Curiosity"],
    dealbreakers: ["Thinking in conventional clichés", "Low aesthetic standards", "Lack of intellectual stamina"],
    loveLanguage: "Intellectual Connection & Words of Affirmation",
    lifestyleScore: { ambition: 10, adventure: 7, social: 7, intellectual: 10, creativity: 9 },
    summary: "Philosophy graduate who decoded human status motivations to build CRED, India's most design-forward fintech unicorn. Looking for someone who can peer behind the curtain of human nature.",
    agentVoice: "Human behavior is an evolutionary puzzle; let's stay up until sunrise dissecting why people love, dream, and chase status."
  },
  {
    id: 18,
    name: "Tanmay Bhat",
    linkedin_url: "https://www.linkedin.com/in/tanmaybhat/",
    instagram_url: "https://www.instagram.com/tanmaybhat/",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    followers: 2100000,
    isVerified: true,
    headline: "Comedian, YouTuber, Advertising Writer & Investor (AIB Co-founder)",
    location: "Mumbai, India",
    needs: ["Uncontrollable laughing fits daily", "Deep understanding of the creator internet economy", "Willingness to play video games together", "Emotional resilience during comebacks"],
    hobbies: ["Gaming (Valorant, GTA)", "Writing viral scripts and comedy sketches", "Meme curation", "Finance podcasting", "Watching stand-up specials"],
    interests: ["Internet virality mechanics", "Advertising history (Ogilvy / CRED ads)", "Personal finance and equities", "Pop culture history", "Comedy writing theory"],
    personality: ["Hilarious", "Resilient", "High energy", "Brutally self-deprecating", "Creative powerhouse"],
    values: ["Laughter as therapy", "Resilience after setbacks", "Creative originality", "Generosity to peers"],
    dealbreakers: ["Taking yourself too seriously", "Inability to laugh at dark humor", "Fragile ego"],
    loveLanguage: "Words of Affirmation & Shared Laughter",
    lifestyleScore: { ambition: 9, adventure: 7, social: 9, intellectual: 8, creativity: 10 },
    summary: "India's comedy pioneer who reinvented himself into an advertising wizard and YouTube juggernaut. He brings unstoppable humor, brilliant marketing brains, and giant belly laughs.",
    agentVoice: "If we can't laugh at our worst disasters together, what's the point? Let's write the funniest chapter of our lives."
  },
  {
    id: 19,
    name: "Varun Mayya",
    linkedin_url: "https://www.linkedin.com/in/varunmayya/",
    instagram_url: "https://www.instagram.com/varunmayya/",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80",
    followers: 750000,
    isVerified: true,
    headline: "Founder at Aeos & Avalon | Author of 'Pyjama Profit' | AI Futurist",
    location: "Bangalore, India",
    needs: ["Fascination with artificial intelligence and the future", "Spontaneous late night coding or ideation energy", "Gaming affinity", "Tolerance for rapid lifestyle pivots"],
    hobbies: ["Video game development", "Synth music composition", "Tinkering with LLM agents", "Shooting cinematic YouTube videos", "Robotics experimentation"],
    interests: ["Autonomous AI agents", "Cyberpunk aesthetics", "Simulation theory", "The future of labor", "Futurism"],
    personality: ["Futuristic visionary", "Rapid executor", "Unfiltered", "Energetic geek", "High-conviction"],
    values: ["Building the future", "Autonomy", "Bold technological optimism", "Speed"],
    dealbreakers: ["Luddite mentality / fear of technology", "Procrastination", "Closed mindset toward the future"],
    loveLanguage: "Shared Projects & Quality Time",
    lifestyleScore: { ambition: 9, adventure: 8, social: 8, intellectual: 9, creativity: 10 },
    summary: "AI futurist and serial founder living inside the world of 2035, building autonomous agents and inspiring millions of young developers. Seeking a partner who is thrilled by the future.",
    agentVoice: "The world is changing faster than anyone realizes; let's build cool things together and step boldly into the future."
  },
  {
    id: 20,
    name: "Deepika Padukone",
    linkedin_url: "https://www.linkedin.com/in/deepikapadukone/",
    instagram_url: "https://www.instagram.com/deepikapadukone/",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    followers: 80000000,
    isVerified: true,
    headline: "Global Icon, Actor, Producer & Founder of Live Love Laugh Foundation & 82°E",
    location: "Mumbai, India",
    needs: ["Deep emotional maturity and mental health empathy", "Grounded calm amid intense public spotlight", "Shared discipline in badminton and fitness", "Unshakable mutual trust"],
    hobbies: ["Badminton (National level background)", "Pilates & functional fitness", "Reading mental health literature", "Interior decor curation", "Quiet dinners with close family"],
    interests: ["De-stigmatizing mental illness globally", "Indian cinema storytelling", "Ayurvedic self-care and skincare (82°E)", "Global fashion ambassadorship", "Social impact"],
    personality: ["Graceful", "Deeply grounded", "Vulnerable advocate", "Focused", "Fiercely protective of peace"],
    values: ["Mental health transparency", "Family bonds", "Dignity under pressure", "Compassion"],
    dealbreakers: ["Dismissiveness toward emotional well-being", "Superficiality", "Breaching privacy or trust"],
    loveLanguage: "Quality Time & Words of Affirmation",
    lifestyleScore: { ambition: 10, adventure: 8, social: 7, intellectual: 8, creativity: 9 },
    summary: "One of the world's most celebrated global cultural icons, renowned for her quiet grace, athletic discipline, and groundbreaking mental health philanthropy. Seeks genuine tranquility.",
    agentVoice: "True strength isn't about hiding our wounds; it's about honoring them and building a space where peace and vulnerability can thrive."
  },
  {
    id: 21,
    name: "Priyanka Chopra Jonas",
    linkedin_url: "https://www.linkedin.com/in/priyanka-chopra/",
    instagram_url: "https://www.instagram.com/priyankachopra/",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    followers: 91000000,
    isVerified: true,
    headline: "Actor, Producer, Entrepreneur (SONA, Anomaly) & UNICEF Goodwill Ambassador",
    location: "Los Angeles & Mumbai",
    needs: ["Someone who can match global ambitions without intimidation", "Unconditional loyalty and family warmth", "Spontaneous adventure across continents", "Playful romance"],
    hobbies: ["Singing and karaoke", "Hosting lavish Sunday brunches", "Playing with her rescue dogs", "Writing essays and memoirs", "Exploring architecture"],
    interests: ["Global storytelling & representation", "UNICEF child rights advocacy", "Culinary entrepreneurship", "Haircare science (Anomaly)", "Cross-cultural bridges"],
    personality: ["Magnetic force of nature", "Fearless", "Deeply affectionate", "Perfectionist on set, goofy at home", "Loyal"],
    values: ["Courage to step outside comfort zones", "Family first", "Empowering the next generation", "Joyful celebration"],
    dealbreakers: ["Small-mindedness or insecurity in a partner", "Lack of ambition", "Coldness toward family"],
    loveLanguage: "Physical Touch & Words of Affirmation",
    lifestyleScore: { ambition: 10, adventure: 10, social: 10, intellectual: 8, creativity: 9 },
    summary: "Global powerhouse bridging Bollywood and Hollywood, whose radiant confidence and heart have made her an international trailblazer. Looking for a fearless, devoted romance.",
    agentVoice: "I dream bigger than the room allows and I love with everything I have; let's take on the world hand in hand."
  },
  {
    id: 22,
    name: "Mark Zuckerberg",
    linkedin_url: "https://www.linkedin.com/in/mark-zuckerberg-618bba58/",
    instagram_url: "https://www.instagram.com/zuck/",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    followers: 14000000,
    isVerified: true,
    headline: "Founder and CEO at Meta",
    location: "Palo Alto & Kauai, Hawaii, USA",
    needs: ["Partnership rooted in multi-decade loyalty", "Hydrofoiling and Jiu-Jitsu training enthusiasm", "Shared dedication to family science philanthropy", "High tolerance for intense operational focus"],
    hobbies: ["Brazilian Jiu-Jitsu & MMA sparring", "Foil surfing behind speedboats", "Cattle ranching in Kauai", "Archery and spear fishing", "Building open-source AI models (Llama)"],
    interests: ["Open-source AI democratization", "Spatial computing & smart glasses", "Curing all diseases this century (Chan Zuckerberg)", "Ancient Roman history (Augustus Caesar)", "Energy engineering"],
    personality: ["Hyper-competitive", "Quietly intense", "Long-term oriented", "Family-centric", "Relentlessly iterating"],
    values: ["Multi-decade execution", "Building things people use every day", "Loyalty", "Relentless stamina"],
    dealbreakers: ["Disloyalty", "Leaking private family life", "Giving up easily when critics attack"],
    loveLanguage: "Acts of Service & Shared Habits",
    lifestyleScore: { ambition: 10, adventure: 9, social: 6, intellectual: 10, creativity: 8 },
    summary: "Meta CEO who connected 3 billion people, now competing in Jiu-Jitsu tournaments, open-sourcing cutting-edge AI, and surfing in Kauai. Seeks fierce, unwavering partnership.",
    agentVoice: "The future belongs to the builders who never quit when things get hard. Let's build something that outlasts the noise."
  },
  {
    id: 23,
    name: "Elon Musk",
    linkedin_url: "https://www.linkedin.com/in/elonmusk/",
    instagram_url: "https://www.instagram.com/elonmusk/",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80",
    followers: 500000,
    isVerified: false,
    headline: "CEO at SpaceX & Tesla | Founder of xAI & Neuralink",
    location: "Austin & Starbase, Texas, USA",
    needs: ["Unwavering tolerance for 100-hour work weeks and sleeping at launchpads", "Shared existential drive to make life multiplanetary", "High meme fluency and dark humor", "Emotional independence"],
    hobbies: ["Playing video games on maximum difficulty (Diablo 4 / Elden Ring)", "Watching rocket tests in Boca Chica", "Writing memes at 2 AM", "Engineering design reviews", "Sci-fi literature"],
    interests: ["Mars colonization architecture", "Reusable orbital rocketry", "Artificial Superintelligence safety (xAI)", "Neural-computer interfaces", "Sustainable energy transition"],
    personality: ["Hyper-intense", "First-principles obsessed", "Mercurial genius", "Meme provocateur", "Relentless"],
    values: ["Consciousness preservation across the stars", "Physics truth", "Raw speed of production", "Existential mission"],
    dealbreakers: ["Bureaucratic compliance", "Whining about long work hours", "Lack of courage to take massive risks"],
    loveLanguage: "Shared Mission & Words of Encouragement",
    lifestyleScore: { ambition: 10, adventure: 10, social: 6, intellectual: 10, creativity: 10 },
    summary: "The visionary architect behind electric vehicles, reusable orbital rockets, and brain chips, driven by an existential mission to extend the light of human consciousness to Mars.",
    agentVoice: "Let's make life interplanetary. If the stakes aren't existentially high and the rockets aren't flying, what are we even doing?"
  },
  {
    id: 24,
    name: "Ratan Tata",
    linkedin_url: "https://www.linkedin.com/in/ratan-tata-b1b5b32/",
    instagram_url: "https://www.instagram.com/ratantata/",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80",
    followers: 9800000,
    isVerified: true,
    headline: "Former Chairman of Tata Sons | Philanthropist & Industrialist (In Memoriam)",
    location: "Mumbai, India",
    needs: ["Endless love and rescue for stray animals", "Quiet dignity above public applause", "Deep moral integrity", "Gentle, understated kindness"],
    hobbies: ["Flying private aircraft / piloting jets", "Rescuing and caring for stray dogs", "Classic car architecture", "Quiet sketching and architectural design", "Listening to classical piano"],
    interests: ["Nation building & social development", "Affordable cancer care hospitals", "Animal welfare centers", "Youth innovation in India", "Industrial design"],
    personality: ["Immensely graceful", "Gentle patriarch", "Quietly courageous", "Humble beyond measure", "Compassionate"],
    values: ["Business as a service to humanity", "Integrity above profits", "Compassion for the voiceless", "Dignity"],
    dealbreakers: ["Arrogance", "Greed and unethical shortcuts", "Cruelty toward animals or the vulnerable"],
    loveLanguage: "Acts of Service & Peaceful Presence",
    lifestyleScore: { ambition: 9, adventure: 7, social: 5, intellectual: 9, creativity: 8 },
    summary: "India's most revered industrialist and humanitarian, celebrated for donating the vast majority of his wealth to public hospitals, stray animal shelters, and national education.",
    agentVoice: "I have always believed that businesses should exist for the good of people. True nobility is lifting others with quiet grace."
  },
  {
    id: 25,
    name: "Sundar Pichai",
    linkedin_url: "https://www.linkedin.com/in/sundar-pichai-7a255b5/",
    instagram_url: "https://www.instagram.com/sundarpichai/",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    followers: 4000000,
    isVerified: true,
    headline: "CEO at Google and Alphabet",
    location: "Los Altos Hills, California, USA",
    needs: ["Calm equanimity in the midst of high-stakes corporate pressure", "Love of cricket and football strategy", "A peaceful, grounded home sanctuary", "Intellectual curiosity for computing"],
    hobbies: ["Playing and watching test cricket", "Morning tea walks in Los Altos", "Reading materials science journals", "Cheering for FC Barcelona", "Coding small puzzle scripts"],
    interests: ["Quantum computing", "Organizing the world's information with Gemini", "Global digital inclusion", "Semiconductor design", "Clean energy for data centers"],
    personality: ["Consummate diplomat", "Gentle leader", "Analytically brilliant", "Unflappable", "Respectful"],
    values: ["Democratizing technology for everyone", "Humility in leadership", "Long-term compounding", "Family privacy"],
    dealbreakers: ["Loud office politics or drama", "Disrespecting peers", "Rushing decisions without analytical thought"],
    loveLanguage: "Quality Time & Acts of Service",
    lifestyleScore: { ambition: 10, adventure: 6, social: 6, intellectual: 10, creativity: 8 },
    summary: "Alphabet CEO who rose from humble beginnings in Chennai to steer the world's greatest information engine. Renowned for his calm demeanor, brilliant intellect, and steady hand.",
    agentVoice: "Technology should empower every human on Earth, no matter where they start. Let's approach life with quiet resolve and infinite curiosity."
  }
];

// Write profiles_analyzed.json to both locations
const dataDir = path.join(__dirname, '../data');
const publicDataDir = path.join(__dirname, '../frontend/public/data');

fs.writeFileSync(path.join(dataDir, 'profiles_analyzed.json'), JSON.stringify(people, null, 2));
fs.writeFileSync(path.join(publicDataDir, 'profiles_analyzed.json'), JSON.stringify(people, null, 2));
console.log('✅ Generated profiles_analyzed.json for all 25 people');

// Generate realistic pairwise matches and conversations for all pairs
const matches = {};
const rankings = {};

for (const p of people) {
  matches[p.id] = {};
  rankings[p.id] = { id: p.id, name: p.name, ranked: [] };
}

// Conversation template generator based on personalities
function generateConversation(pA, pB) {
  // Compute realistic compatibility score based on shared interests & lifestyle
  let baseScore = 50;
  
  // Ambition compatibility
  const ambDiff = Math.abs(pA.lifestyleScore.ambition - pB.lifestyleScore.ambition);
  baseScore += (5 - ambDiff) * 3;
  
  // Intellectual compatibility
  const intDiff = Math.abs(pA.lifestyleScore.intellectual - pB.lifestyleScore.intellectual);
  baseScore += (5 - intDiff) * 2;
  
  // Adventure compatibility
  const advDiff = Math.abs(pA.lifestyleScore.adventure - pB.lifestyleScore.adventure);
  baseScore += (5 - advDiff) * 2;
  
  // Specific chemistry bonuses
  if (pA.values.some(v => pB.values.includes(v))) baseScore += 10;
  
  // Random spice
  const score = Math.min(97, Math.max(48, Math.round(baseScore + (Math.sin(pA.id * 13 + pB.id * 7) * 8))));
  
  // Dialogues
  const conv = [
    {
      agent: "A",
      name: pA.name,
      message: `Hey! I'm representing ${pA.name}. I read your background — I noticed you're deeply into ${pB.interests[0]} and value ${pB.values[0]}. That caught my eye immediately.`
    },
    {
      agent: "B",
      name: pB.name,
      message: `Hi there! Thanks for reaching out. ${pB.name}'s lifestyle is big on ${pB.hobbies[0]} and living with ${pB.values[1] || pB.values[0]}. And from what I see about ${pA.name}, you're not afraid of thinking big either.`
    },
    {
      agent: "A",
      name: pA.name,
      message: `Not at all. For ${pA.name}, a core non-negotiable is ${pA.needs[0]}. We believe life should have both high ambition and genuine depth. How does ${pB.name} navigate balancing big missions with personal life?`
    },
    {
      agent: "B",
      name: pB.name,
      message: `That resonates so much. ${pB.name} actually looks for ${pB.needs[1] || pB.needs[0]}. When you're both building meaningful things, the best connection is having someone who truly gets the drive without demanding you shrink yourself.`
    },
    {
      agent: "A",
      name: pA.name,
      message: `Exactly. If we went on a first date, would it be something high-energy like ${pA.hobbies[1] || 'traveling'} or a quiet conversation about ${pB.interests[1] || 'the future'}?`
    },
    {
      agent: "B",
      name: pB.name,
      message: `Why not both? Start with an adventure, then find a quiet place to dive into ${pA.interests[0]} until midnight. I think our energies would bounce off each other in the best way.`
    }
  ];

  const sparks = [
    `Aligned on ${pA.values[0]} and ${pB.values[0]}`,
    `Mutual respect for high-agency living and ${pA.interests[0]}`,
    `Complementary lifestyle scores in ambition and intellect`
  ];

  const tensions = [
    `Balancing busy schedules with ${pA.needs[0]}`,
    `Navigating different communication cadences under high stress`
  ];

  const matchReason = `${pA.name} and ${pB.name} share an exceptional alignment around ${pA.values[0]} and ambitious execution, while offering each other grounded emotional balance.`;

  return { conversation: conv, compatibilityScore: score, matchReason, sparks, tensions };
}

// Generate all pairs
for (let i = 0; i < people.length; i++) {
  for (let j = 0; j < people.length; j++) {
    if (i === j) continue;
    const pA = people[i];
    const pB = people[j];
    
    const match = generateConversation(pA, pB);
    matches[pA.id][pB.id] = { ...match, personA: pA.id, personB: pB.id };
    rankings[pA.id].ranked.push({
      id: pB.id,
      name: pB.name,
      score: match.compatibilityScore,
      reason: match.matchReason
    });
  }
}

// Sort rankings descending by score
for (const id in rankings) {
  rankings[id].ranked.sort((a, b) => b.score - a.score);
}

fs.writeFileSync(path.join(dataDir, 'matches.json'), JSON.stringify(matches, null, 2));
fs.writeFileSync(path.join(publicDataDir, 'matches.json'), JSON.stringify(matches, null, 2));
fs.writeFileSync(path.join(dataDir, 'rankings.json'), JSON.stringify(rankings, null, 2));
fs.writeFileSync(path.join(publicDataDir, 'rankings.json'), JSON.stringify(rankings, null, 2));

console.log('✅ Generated matches.json and rankings.json for all 25 people (600 pair simulations)!');
