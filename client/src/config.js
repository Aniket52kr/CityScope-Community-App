// src/config.js
const config = {
  appName: 'CityScope',
  api: {
    baseUrl: '/api',
    postTypes: [
      'Recommend a place',
      'Ask for help',
      'Share a local update',
      'Event announcement',
    ],
  },
  features: {
    enableReactions: true,
    enableTags: true,
    imageUploadEnabled: true,
  },
};

export default config