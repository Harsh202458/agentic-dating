export const SCRAPER_CONFIG = {
  linkedin: {
    actorId: process.env.APIFY_LINKEDIN_ACTOR || 'johnvc/linkedin-profile-api',
    timeoutSecs: 180,
  },
  instagram: {
    actorId: process.env.APIFY_INSTAGRAM_ACTOR || 'apify/instagram-profile-scraper',
    timeoutSecs: 90,
  },
};
