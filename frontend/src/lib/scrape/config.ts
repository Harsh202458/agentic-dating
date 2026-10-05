export const SCRAPER_CONFIG = {
  linkedin: {
    actorId: process.env.APIFY_LINKEDIN_ACTOR || 'bebity/linkedin-profile-scraper',
    timeoutSecs: 90,
  },
  instagram: {
    actorId: process.env.APIFY_INSTAGRAM_ACTOR || 'apify/instagram-profile-scraper',
    timeoutSecs: 90,
  },
};
