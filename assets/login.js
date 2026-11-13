// Sign in / sign up page: Google only.
// Signing in and signing up are the same step: the account is created the first time a person signs in.
import "./auth.js";

const A = window.thaliAuth;
const $ = (id) => document.getElementById(id);
const status = (text, err) => { const s = $("lstatus"); s.textContent = text || ""; s.className = "status" + (err ? " err" : ""); };

const MESSAGES = {
  "auth/popup-closed-by-user": "Sign-in window was closed. Try again.",
  "auth/cancelled-popup-request": "Sign-in window was closed. Try again.",
  "auth/too-many-requests": "Too many attempts. Please wait a few minutes and try again.",
  "auth/network-request-failed": "No internet connection. Check your network and try again.",
  "auth/requires-recent-login": "For safety, sign out, sign in again, and then delete the account.",
  "auth/operation-not-allowed": "Google sign-in is not switched on yet in the Firebase console.",
  "auth/unauthorized-domain": "This domain is not added to the authorised domains in the Firebase console.",
};
const explain = (e) => MESSAGES[e && e.code] || "Sign-in did not work. Please try again.";

let justSignedIn = false, deleteArmed = false;

function paint() {
  const u = A.user;
  $("signedout").hidden = !!u;
  $("signedin").hidden = !u;
  if (u) $("who").textContent = u.displayName || u.email || "your account";
  if (u && justSignedIn) location.href = "/";
}

await A.ready;

if (!A.configured || A.failed) {
  status(A.failed
    ? "Sign-in could not load. Check your internet connection and refresh the page."
    : "Sign-in is not set up yet. Site owner: add your Firebase config in assets/firebase-config.js.", true);
  $("google").disabled = true;
} else {
  const { mod, auth } = A;
  document.addEventListener("thali-auth", paint);
  paint();

  $("google").onclick = async () => {
    const provider = new mod.GoogleAuthProvider();
    status("Opening Google sign-in.");
    try {
      justSignedIn = true;
      await mod.signInWithPopup(auth, provider);
    } catch (e) {
      justSignedIn = false;
      if (e && e.code === "auth/popup-blocked") { justSignedIn = true; return mod.signInWithRedirect(auth, provider); }
      status(explain(e), true);
    }
  };

  $("signout").onclick = async () => { await mod.signOut(auth); status("You are signed out."); };
  $("delete").onclick = async () => {
    if (!deleteArmed) { deleteArmed = true; $("delete").textContent = "Tap again to delete permanently"; return; }
    try {
      await A.user.delete();
      status("Your account has been deleted.");
    } catch (e) {
      status(explain(e), true);
    } finally {
      deleteArmed = false; $("delete").textContent = "Delete my account";
    }
  };
}
