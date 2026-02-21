import * as mockApiRes from "./mock-api-data";

export const AD_DOMAINS = [
  "google-analytics",
  "connect.facebook.net",
  "doubleclick.net",
  "googleadservices.com",
  "cdn.taboola.com",
  "forter",
];

export const ANALYTICS_DOMAINS = [
  "loyalty",
  "bing.com",
  "criteo.com",
  "tapad.com",
  "bento.agoda.com/v2",
  "cloudfront.net",
  "google.com",
  "static.tacdn.com",
  "analytics.skyscanner.net",
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

export const MOCK_API = [
  {
    api: "**/api/cronos/loyalty/getloyaltybanners",
    res: mockApiRes.getloyaltybannersResponse,
  },
  {
    api: "**/api/card/campaigns",
    res: mockApiRes.campaignsResponse,
  },
  {
    api: "**/api/cronos/layout/GetHotCities",
    res: mockApiRes.getHotCitiesResponse,
  },
  {
    api: "**/api/cronos/home/GetTopDestinations",
    res: mockApiRes.getTopDestinations,
  },
];
