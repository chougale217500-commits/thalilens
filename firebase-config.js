// Paste your Firebase web app config here.
// Firebase console > Project settings > General > Your apps > Web app > SDK setup and configuration.
export const firebaseConfig = {
  apiKey: "AIzaSyDtP3ALuVlqrghgyxlyjdUrVo0KChmTeRk",
  authDomain: "thalilens-10650.firebaseapp.com",
  projectId: "thalilens-10650",
  appId: "1:887412901365:web:b7a8102f3537c4bbf38cbc",
};

// true: visitors must sign in before they can analyse food.
// false: sign-in is optional and anyone can analyse.
export const REQUIRE_LOGIN = true;

// Until the config above is filled in, sign-in stays off and the site works without it.
export const isConfigured = !firebaseConfig.apiKey.startsWith("PASTE");
