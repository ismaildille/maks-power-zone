# MAK's Power Zone — Firebase setup

Firebase project: makspowerzone2026. This is a prepared package, not an active deployment.

1. Firebase Console > Build > Authentication > Get started > Sign-in method > Email/Password > Enable.
2. Authentication > Users > Add user. Create your own strong password. Copy that user's UID (not the password).
3. Authentication > Settings > Authorized domains: add `ismaildille.github.io` if missing.
4. Build > Firestore Database > Create database > production mode. Choose a region.
5. Firestore Database > Rules: paste `firestore.rules`, replacing `REPLACE_WITH_OWNER_UID` with your exact owner UID, then Publish. Only that UID can write.
6. Upload `index.html`, `admin.html`, `admin.js`, `store-firebase.js`, `firebase-config.js` to the root of your GitHub Pages repository. Keep existing `catalog.json`.
7. Visit https://ismaildille.github.io/maks-power-zone/admin.html and sign in. First authorized login imports the existing 21 catalog items from `catalog.json` into Firestore.
8. Test: make a price change in admin and confirm storefront reflects it. Test with a different Firebase account; it must not be able to edit products.

IMPORTANT: Firebase configuration is public, not a password. The login page itself is not the security boundary; Firestore rules are. Never share or upload service account keys. Firestore is the live catalog after initial import; `catalog.json` remains a static fallback if Firestore cannot load. Product image URL editing and WhatsApp setting editing are not yet included in this owner dashboard. If an item is edited in Firestore it will not automatically update catalog.json.
