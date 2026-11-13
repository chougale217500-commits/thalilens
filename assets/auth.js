// Loads Firebase Authentication on every page and keeps the header link in sync.
// Other scripts read window.thaliAuth: { configured, required, user, ready, getToken() }.
import { firebaseConfig, REQUIRE_LOGIN, isConfigured } from "./firebase-config.js";

const state = { configured: isConfigured, required: isConfigured && REQUIRE_LOGIN, user: null, auth: null, mod: null, failed: false };
let done;
state.ready = new Promise((resolve) => { done = resolve; });
state.getToken = async () => (state.user ? state.user.getIdToken() : null);
window.thaliAuth = state;

const link = document.getElementById("authlink");
function paint() {
  if (!link) return;
  link.textContent = state.user ? "Account" : "Sign in";
}

if (!isConfigured) {
  done(state);
} else {
  try {
    const V = "https://www.gstatic.com/firebasejs/10.12.2/";
    const [{ initializeApp }, mod] = await Promise.all([import(V + "firebase-app.js"), import(V + "firebase-auth.js")]);
    state.mod = mod;
    state.auth = mod.getAuth(initializeApp(firebaseConfig));
    state.auth.useDeviceLanguage();
    mod.onAuthStateChanged(state.auth, (user) => {
      state.user = user;
      paint();
      done(state);
      document.dispatchEvent(new CustomEvent("thali-auth"));
    });
  } catch (e) {
    console.error("Sign-in could not load", e);
    state.failed = true;
    done(state);
  }
}
