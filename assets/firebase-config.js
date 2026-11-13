// Paste your Firebase web app config here.
// Firebase console > Project settings > General > Your apps > Web app > SDK setup and configuration.
export const firebaseConfig = {
  apiKey: "PASTE_API_KEY",
  authDomain: "PASTE_PROJECT_ID.firebaseapp.com",
  projectId: "PASTE_PROJECT_ID",
  appId: "PASTE_APP_ID",
};

// true: visitors must sign in before they can analyse food.
// false: sign-in is optional and anyone can analyse.
export const REQUIRE_LOGIN = true;

// Until the config above is filled in, sign-in stays off and the site works without it.
export const isConfigured = !firebaseConfig.apiKey.startsWith("PASTE");
