# Annett & Soren Firebase migration and quota hardening

## Important status
- The website frontend is configured for Firebase project `annettandsorenwedding` and the `(default)` Firestore database.
- RSVP maintenance remains enabled in the page and API. Do not reopen until the import and tests are complete.
- The server now uses Firebase Admin SDK. The public Firebase web config is not used for privileged server writes.
- The old project is not changed by this code. Do not delete it until the new project has been validated.

## 1. Configure Vercel server environment
In Vercel → Project → Settings → Environment Variables, add for Production (and Preview if needed):

- `FIREBASE_PROJECT_ID` = `annettandsorenwedding`
- `FIREBASE_SERVICE_ACCOUNT_JSON` = the full JSON contents of a service-account key created for the new Firebase project. Alternatively use `FIREBASE_SERVICE_ACCOUNT_JSON_BASE64` with the base64-encoded JSON.
- `ADMIN_PASSCODE` = your chosen admin passcode
- `ADMIN_SESSION_SECRET` = a long random secret (at least 32 random bytes)
- `RSVP_MAINTENANCE_MODE` = `true`

Never commit a service-account JSON file or paste its private key into chat. The web app config in `firebase-applet-config.json` is not a service-account key.

## 2. Firestore rules
Deploy `firestore.rules` to the new project. Browser access is denied; all database operations go through the server's Admin SDK, which bypasses Firestore rules. This prevents public clients from reading the guest list directly.

## 3. Import the exported RSVP CSV
1. Keep the CSV backup in a private local folder. Do not commit it to GitHub.
2. Place the CSV in the project root, or pass its path to the script.
3. Download a service-account JSON key for `annettandsorenwedding` and save it locally as `serviceAccountKey.json` (already ignored by `.gitignore`), or set `FIREBASE_SERVICE_ACCOUNT_JSON` locally.
4. Install dependencies, then run a dry-run first:

   `npm run migrate:rsvps -- "annett_and_soren_wedding_rsvps_2026-10-18.csv" --dry-run`

Review the `wouldCreate`, `skipped`, and `conflicts` counts. If the counts look correct, run the actual import:

   `npm run migrate:rsvps -- "annett_and_soren_wedding_rsvps_2026-10-18.csv"`

The import is create-only: it skips existing RSVP document IDs and reports phone-index conflicts instead of overwriting them. Check the final created/skipped/conflicts counts. Keep the original CSV unchanged.

## 4. Important limitation of the CSV export
The CSV contains guest IDs, names, phone numbers, answers, digital codes and timestamps, but not QR-token hashes or check-in history. Imported guests will be marked `unused` until checked in. After migration, guests must re-enter their exact original full name and phone number to recover/reissue their e-card; the newly issued QR token is stored as a hash and can then be checked in. Previously issued QR images cannot be validated against the new database because their token hashes were not in the CSV. If check-in status matters, recover it from a separate source before opening the gate scanner.

## 5. Test before reopening
Keep `RSVP_MAINTENANCE_MODE=true` and the maintenance notice enabled while testing:
- `/api/health` reports project ID `annettandsorenwedding` and `rsvpMaintenance: true`.
- Admin login works and `/api/admin/rsvps` shows the imported records.
- An exact name + phone submission finds the existing RSVP and returns `recovered: true` with an e-card token.
- A different name using an already-indexed phone is rejected.
- QR check-in uses a targeted `qrTokenHash` query and rejects second use.
- Stats use Firestore aggregation queries rather than reading every RSVP document.

When everything is verified, change `RSVP_TEMPORARILY_UNAVAILABLE` to `false` in `src/components/RsvpForm.tsx` and set `RSVP_MAINTENANCE_MODE=false` in Vercel, then redeploy. Do not do this until the new database and imported data have been checked.
