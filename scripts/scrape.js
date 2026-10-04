require('dotenv').config();
const { ApifyClient } = require('apify-client');
const fs = require('fs');
const path = require('path');

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });
const people = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/people.json'), 'utf8'));

// --- INSTAGRAM SCRAPER ---
async function scrapeInstagram(usernames) {
  console.log(`\n🔍 Scraping Instagram for: ${usernames.join(', ')}`);
  const run = await client.actor('apify/instagram-profile-scraper').call({
    usernames: usernames,
  });
  const { items } = await client.dataset(run.defaultDatasetId).listItems();
  return items;
}

// --- LINKEDIN SCRAPER ---
async function scrapeLinkedIn(linkedinUrls) {
  console.log(`\n🔍 Scraping LinkedIn for ${linkedinUrls.length} profiles`);
  const run = await client.actor('bebity/linkedin-profile-scraper').call({
    profileUrls: linkedinUrls,
  });
  const { items } = await client.dataset(run.defaultDatasetId).listItems();
  return items;
}

function extractInstagramUsername(url) {
  const match = url.match(/instagram\.com\/([^\/\?#]+)/);
  return match ? match[1] : null;
}

async function main() {
  const results = [];

  // Extract usernames
  const instagramUsernames = people.map(p => extractInstagramUsername(p.instagram)).filter(Boolean);
  const linkedinUrls = people.map(p => p.linkedin);

  // Run both scrapers in parallel
  console.log('🚀 Starting parallel scraping of Instagram + LinkedIn...');
  const [igData, liData] = await Promise.allSettled([
    scrapeInstagram(instagramUsernames),
    scrapeLinkedIn(linkedinUrls),
  ]);

  const igItems = igData.status === 'fulfilled' ? igData.value : [];
  const liItems = liData.status === 'fulfilled' ? liData.value : [];

  console.log(`✅ Instagram: ${igItems.length} profiles scraped`);
  console.log(`✅ LinkedIn: ${liItems.length} profiles scraped`);

  // Merge by person
  for (const person of people) {
    const igUsername = extractInstagramUsername(person.instagram);
    const igProfile = igItems.find(i => i.username?.toLowerCase() === igUsername?.toLowerCase()) || {};
    const liProfile = liItems.find(l => l.url?.includes(person.linkedin) || person.linkedin.includes(l.publicIdentifier || '')) || {};

    results.push({
      id: person.id,
      name: person.name,
      linkedin_url: person.linkedin,
      instagram_url: person.instagram,
      instagram: {
        username: igProfile.username || igUsername,
        fullName: igProfile.fullName || person.name,
        bio: igProfile.biography || '',
        followers: igProfile.followersCount || 0,
        following: igProfile.followsCount || 0,
        posts: igProfile.postsCount || 0,
        profilePicUrl: igProfile.profilePicUrl || '',
        isVerified: igProfile.verified || false,
        latestPosts: (igProfile.latestIgtvVideos || igProfile.latestPosts || []).slice(0, 5).map(p => ({
          caption: p.caption || '',
          likes: p.likesCount || 0,
          hashtags: (p.hashtags || []).slice(0, 10),
        })),
      },
      linkedin: {
        headline: liProfile.headline || '',
        about: liProfile.summary || liProfile.about || '',
        location: liProfile.location || '',
        skills: (liProfile.skills || []).slice(0, 20),
        experience: (liProfile.positions || liProfile.experience || []).slice(0, 5).map(e => ({
          title: e.title || '',
          company: e.companyName || e.company || '',
          duration: e.duration || '',
        })),
        education: (liProfile.educations || liProfile.education || []).slice(0, 3).map(e => ({
          school: e.schoolName || e.school || '',
          degree: e.degreeName || e.degree || '',
          field: e.fieldOfStudy || '',
        })),
      },
    });
  }

  fs.writeFileSync(
    path.join(__dirname, '../data/profiles_raw.json'),
    JSON.stringify(results, null, 2)
  );
  console.log('\n✅ profiles_raw.json written with', results.length, 'people');
}

main().catch(console.error);
