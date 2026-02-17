export const AD_DOMAINS = [
  "google-analytics",
  "facebook",
  "doubleclick",
  "googleadservices",
  "taboola.com",
  "forter.com",
  "bing",
];

export const ANALYTICS_DOMAINS = [
  "loyalty",
  "bing.com",
  "criteo.com",
  "tapad.com",
  "bento.agoda.com/v2",
  "cloudfront.net",
];

export const GOOGLE_SIGNIN_DOMAINS = [
  "accounts.google.com/gsi/",
  "ssl.gstatic.com/accounts/ui/",
  "googleads.g.doubleclick.net",
];

export const ALL_BLACKLISTED = [
  ...AD_DOMAINS,
  ...ANALYTICS_DOMAINS,
  ...GOOGLE_SIGNIN_DOMAINS,
];
