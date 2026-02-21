export const campaignsResponse = {
  isSuccess: true,
  result: {
    requestId: "d48074ae-dadb-4431-9ff0-b7c62687a428",
    sections: [
      {
        sectionName: "home_contents",
        cards: [
          {
            cardId: 2783,
            cardName: "Home PageTheme Default",
            priority: 1,
            cardType: "content_card",
            categories: [
              {
                categoryId: 204,
                categoryName: "uncategorized",
                categoryDescription: "uncategorized",
                priority: 204,
                parentPriorityId: null,
              },
            ],
            productFunnel: "hotel",
            content: {
              imageUrl: " ",
              imageRedirectLink: null,
              title: " ",
              description: "",
              buttonText: " ",
              buttonUrl: " ",
              buttonType: null,
              contentMetaInfo: "[]",
              contentMetaInfoKeyValue: {},
            },
            dynamicContent: null,
            surveyContent: null,
            toolkitPlacement: null,
          },
        ],
        categories: [
          {
            categoryId: 204,
            categoryName: "uncategorized",
            categoryDescription: "uncategorized",
            priority: 204,
            parentPriorityId: null,
          },
        ],
      },
    ],
  },
  error: null,
};

export const getHotCitiesResponse = {
  searchHistoryViewModel: {
    recentSearchList_AllTypes: [],
    abandonedCartList: [],
    recentSearchList_CityAndHotel: [],
    showResentSearchesAboveTheFold: false,
    totalItem: 0,
  },
};

export const getTopDestinations = {
  destinationsHeader: "Most popular destinations",
  topDestinations: [],
  topDomesticDestinations: [
    {
      activityCityUrl: "/activities/city/vietnam/ho_chi_minh_city",
      cityId: 13170,
      countryId: 38,
      cityName: "Ho Chi Minh City",
      cityNameEnglish: "Ho Chi Minh City",
      cityUrl: "",
      imageUrl: null,
      imageUrls: {
        w396h298: "",
        w328h328: "",
        w345h345: "",
        w694h298: "",
        w200h200: "",
        w390h168: "",
        w762h328: "",
        w100h100: "",
      },
      countryName: "Vietnam",
      countryNameEnglish: "Vietnam",
      noOfHotels: 15546,
      formattedNoOfHotels: "15,546",
      searchUrl: "",
      propertyText: "properties",
      travelGuideUrl: null,
    },
  ],
  domesticCountry: {
    languageId: 1,
    countryId: 38,
    countryName: "Vietnam",
    countryNameIn: "in Vietnam",
    topDomesticCityFallback: "Top destinations in Vietnam",
    topInternationalCityFallback: "Popular destinations outside Vietnam",
  },
};

export const getloyaltybannersResponse = {
  prominentAppDownload: null,
  whiteBanner: null,
  downloadConfirmationBanner: null,
};
