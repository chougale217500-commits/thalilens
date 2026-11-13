# Thali Lens website

Indian food ki photo ya naam se dish, ingredients aur nutrition batane wali website.
SEO aur AdSense ke liye ready. Poora setup free tools par chalta hai; sirf domain ka kharcha hai.

## Kya free hai aur kya nahi

| Cheez | Kharcha |
|---|---|
| Hosting: Cloudflare Pages | Free |
| Login: Firebase Authentication (sirf Google sign-in) | Free |
| AI analysis: Google Gemini API free tier | Free, lekin roz ki limit hai |
| Domain (jaise thalilens.in) | Saal ka kharcha lagta hai. AdSense ke liye apna domain zaroori hai |

Dhyan rakho:
- Gemini free tier ki limit khatam hone par us din analysis band ho jaata hai aur site
  "free daily limit is used up" dikhati hai. Current limit aistudio.google.com/rate-limit par dekho.
- Free tier me bheja gaya data Google apne models sudharne ke liye use kar sakta hai.
  Privacy Policy me yeh likha hua hai.
- Vercel ka free (Hobby) plan AdSense wali site ke liye allowed nahi hai, isliye yeh package
  Cloudflare Pages ke liye bana hai.

## Is folder me kya hai

| File | Kaam |
|---|---|
| `index.html` | Home page + analyser (upload, camera, drag-drop, paste, food name) |
| `indian-food-calories.html` | 28 Indian dishes ka calorie chart (content page) |
| `guides/` | 12 nutrition articles + unka index page (AdSense aur Google search ke liye content) |
| `calorie-calculator.html`, `assets/calc.js` | Daily calorie + BMI calculator (bina AI ke chalta hai, koi limit nahi) |
| `_headers` | Cloudflare Pages ke security aur cache headers |
| `about.html`, `contact.html`, `privacy.html`, `terms.html` | AdSense ke liye zaroori pages |
| `login.html`, `assets/auth.js`, `assets/login.js`, `assets/firebase-config.js` | Google se sign in / sign up |
| `functions/api/analyze.js` | Backend: photo ya naam ko AI model ke paas bhejta hai |
| `assets/` | CSS, JS, logo, social share image |
| `favicon.ico`, `favicon.svg`, `icon-*.png`, `apple-touch-icon.png` | Favicon aur app icons |
| `robots.txt`, `sitemap.xml`, `site.webmanifest`, `ads.txt` | SEO aur AdSense files |

## Live karne ke steps

1. **Domain ka naam badlo:** sab files me `YOURDOMAIN.com` ko apne domain se replace karo
   (VS Code me Ctrl+Shift+H). `contact@YOURDOMAIN.com` ki jagah apna asli email likho.
2. **Gemini API key lo (free):** aistudio.google.com par Google account se login karo aur
   "Get API key" se key banao. Billing mat jodo, to paise nahi katenge.
3. **GitHub par daalo:** is folder ko ek GitHub repo me upload karo.
4. **Cloudflare Pages par deploy karo:**
   - dash.cloudflare.com > Workers & Pages > Create > Pages > Connect to Git, repo chuno.
   - Build command khaali chhodo. Output directory `/` rakho.
   - Settings > Variables and Secrets me `GEMINI_API_KEY` daalo.
   - Model ka naam `functions/api/analyze.js` me default `gemini-2.5-flash` hai. Agar AI Studio
     me koi naya free model dikhe, to `GEMINI_MODEL` variable me uska naam daal do.
   - Custom domains me apna domain jodo.
5. **Google login chalu karo** (neeche wala section).
6. **Test karo:** site kholo, login karo, photo se aur naam se analyse karke dekho.
7. **Google Search Console:** search.google.com/search-console me domain add karo aur
   `https://YOURDOMAIN.com/sitemap.xml` submit karo.
8. **AdSense apply karo:** adsense.google.com par site add karo. Jo script mile use har HTML
   file ke `<head>` me `ADSENSE` comment ki jagah paste karo.
9. **Approval ke baad:** `ads.txt` me AdSense ki di hui line daalo.

## Google login chalu karna (free)

Jab tak config nahi bharoge, login band rahega aur site bina login ke chalegi.

1. console.firebase.google.com par project banao (free Spark plan), phir
   **Build > Authentication > Get started**.
2. **Sign-in method** me **Google** ko Enable karo.
3. **Authentication > Settings > Authorized domains** me apna domain jodo.
4. **Project settings > Your apps > Web app** banao aur uska config `assets/firebase-config.js`
   me paste karo.
5. Usi file me `REQUIRE_LOGIN`:
   - `true`: analyse karne se pehle login zaroori. Isse aapki free AI limit bachti hai.
   - `false`: login optional.
6. Cloudflare me `FIREBASE_API_KEY` variable daalo (wahi `apiKey` jo config me hai). Isse
   server bhi login check karta hai. Iske bina koi bhi seedha API ko call karke aapki free
   limit kha sakta hai.

Pages (home, calorie chart, policy pages) hamesha bina login ke khulte hain, taaki Google unhe
padh sake. Sirf analyse karne par login maanga jaata hai.

## Traffic badhane ke liye jo is site me hai

- **12 guides** (`/guides/`): roti, rice, dal, paneer, dosa, biryani, snacks, sweets, chai, protein, thali, breakfast.
  Log Google par yahi cheezein search karte hain. Har guide se analyser ka link hai.
- **Calorie + BMI calculator:** alag search traffic laata hai aur AI limit use nahi karta.
- **Share on WhatsApp:** result ke neeche button hai; message me aapki site ka link jaata hai.
- **Today's log:** user din bhar ke meals jod sakta hai (sirf uske phone me save hota hai), isliye log wapas aate hain.
- Naye guides jodte raho, hafte me 1 ya 2. Kisi guide file ko copy karke naya topic likho aur `sitemap.xml` me jodo.
- Free visitor count ke liye Cloudflare dashboard me **Web Analytics** on kar do.

## AdSense approval ke liye dhyan rakho

- Approval ki guarantee koi nahi de sakta; faisla Google ka hota hai.
- Apply karne se pehle site ko Google me index hone do aur thode real visitors aane do.
- Aur content pages jodo (jaise "paneer calories", "dosa nutrition", "weight loss thali").
  Sirf tool wali site ko Google aksar "low value content" bol kar reject karta hai.
  12 guides pehle se hain; aur jodoge to chance badhta hai.
- Guides ke numbers approximate hain. Publish se pehle ek baar padh lo aur jo galat lage use theek karo.
- Naya page banao to use `sitemap.xml` me bhi jodo.
- Content copy mat karo. Privacy, Terms, About, Contact pages hata mat dena.
- Europe ke visitors ke liye AdSense ke "Privacy & messaging" me consent message on karo.

## Note

- Nutrition values estimate hain. Calorie chart ke numbers bhi approximate hain; publish karne
  se pehle ek baar dekh lo.
- Agar baad me paid AI use karna ho, to `GEMINI_API_KEY` hata kar `ANTHROPIC_API_KEY` daal do;
  backend dono ko support karta hai.
