require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

function buildPrompt(person) {
  const ig = person.instagram;
  const li = person.linkedin;
  const posts = ig.latestPosts?.map(p => `- "${p.caption?.slice(0, 200)}" [${p.likes} likes]`).join('\n') || 'No posts available';
  const skills = li.skills?.join(', ') || 'Not listed';
  const experience = li.experience?.map(e => `${e.title} at ${e.company}`).join(', ') || 'Not listed';
  const education = li.education?.map(e => `${e.degree} in ${e.field} from ${e.school}`).join(', ') || 'Not listed';

  return `
You are an expert relationship psychologist and personality analyst. Analyze this person based ONLY on their public LinkedIn and Instagram data.

PERSON: ${person.name}

LINKEDIN:
- Headline: ${li.headline || 'N/A'}
- About: ${li.about || 'N/A'}
- Skills: ${skills}
- Experience: ${experience}
- Education: ${education}
- Location: ${li.location || 'N/A'}

INSTAGRAM:
- Bio: ${ig.bio || 'N/A'}
- Followers: ${ig.followers?.toLocaleString() || 'N/A'}
- Verified: ${ig.isVerified}
- Recent posts:
${posts}

Based on ALL of the above, return ONLY valid JSON (no markdown, no explanation):
{
  "needs": ["list of 4-6 things this person needs in a relationship/partner"],
  "hobbies": ["list of 4-6 clear hobbies or activities they enjoy"],
  "interests": ["list of 4-6 intellectual/topical interests"],
  "personality": ["list of 4-6 personality traits"],
  "values": ["list of 4-6 core values"],
  "dealbreakers": ["list of 3-4 likely dealbreakers for them"],
  "loveLanguage": "their likely primary love language",
  "lifestyleScore": { "ambition": 0-10, "adventure": 0-10, "social": 0-10, "intellectual": 0-10, "creativity": 0-10 },
  "summary": "A 2-3 sentence vivid description of who they are as a person and potential partner",
  "agentVoice": "A short first-person statement (1 sentence) this person's agent would say when introducing itself",
  "photo": "${ig.profilePicUrl || ''}"
}
`;
}

async function analyzePersons() {
  const rawPath = path.join(__dirname, '../data/profiles_raw.json');
  if (!fs.existsSync(rawPath)) {
    console.error('❌ profiles_raw.json not found. Run scrape.js first.');
    process.exit(1);
  }

  const people = JSON.parse(fs.readFileSync(rawPath, 'utf8'));
  const analyzed = [];

  for (let i = 0; i < people.length; i++) {
    const person = people[i];
    console.log(`\n🧠 [${i + 1}/${people.length}] Analyzing ${person.name}...`);

    try {
      const prompt = buildPrompt(person);
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();

      // Parse JSON safely
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON found in response');

      const analysis = JSON.parse(jsonMatch[0]);
      analyzed.push({
        id: person.id,
        name: person.name,
        linkedin_url: person.linkedin_url,
        instagram_url: person.instagram_url,
        photo: person.instagram?.profilePicUrl || '',
        followers: person.instagram?.followers || 0,
        isVerified: person.instagram?.isVerified || false,
        headline: person.linkedin?.headline || '',
        location: person.linkedin?.location || '',
        ...analysis,
      });

      console.log(`   ✅ Done: ${analysis.summary?.slice(0, 80)}...`);
    } catch (err) {
      console.error(`   ❌ Error analyzing ${person.name}: ${err.message}`);
      // Add fallback
      analyzed.push({
        id: person.id,
        name: person.name,
        linkedin_url: person.linkedin_url,
        instagram_url: person.instagram_url,
        photo: person.instagram?.profilePicUrl || '',
        followers: person.instagram?.followers || 0,
        headline: person.linkedin?.headline || '',
        location: person.linkedin?.location || '',
        needs: ['Connection', 'Growth', 'Authenticity', 'Ambition'],
        hobbies: ['Building', 'Reading', 'Travel', 'Networking'],
        interests: ['Technology', 'Entrepreneurship', 'Philosophy', 'Health'],
        personality: ['Driven', 'Curious', 'Independent', 'Thoughtful'],
        values: ['Integrity', 'Excellence', 'Innovation', 'Impact'],
        dealbreakers: ['Lack of ambition', 'Dishonesty', 'Closed-mindedness'],
        loveLanguage: 'Acts of Service',
        lifestyleScore: { ambition: 9, adventure: 7, social: 7, intellectual: 9, creativity: 7 },
        summary: `${person.name} is a driven individual with strong professional achievements and a passion for building meaningful things.`,
        agentVoice: `I represent ${person.name} — someone who values depth, ambition, and genuine connection.`,
      });
    }

    // Small delay to avoid rate limiting
    if (i < people.length - 1) await new Promise(r => setTimeout(r, 1500));
  }

  fs.writeFileSync(
    path.join(__dirname, '../data/profiles_analyzed.json'),
    JSON.stringify(analyzed, null, 2)
  );
  console.log(`\n✅ profiles_analyzed.json written with ${analyzed.length} people!`);
}

analyzePersons().catch(console.error);
