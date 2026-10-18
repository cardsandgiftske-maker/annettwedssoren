# Annett & Soren Wedding Website

This project is configured for the standard Firebase project `annettandsorenwedding` and its `(default)` Firestore database. The previous AI Studio database and Diana & Charles' project are not changed by this repository.

## Current safety status

RSVP maintenance is intentionally enabled until the new database is configured, the exported guest CSV is imported, and the RSVP/admin/check-in flows are tested. Do not reopen submissions before those checks pass.

## Local setup

1. Install dependencies with `npm install`.
2. Set the Firebase Admin service-account credentials and project ID as described in [MIGRATION-README.md](./MIGRATION-README.md).
3. Run `npm run dev`.
4. The `/api/health` endpoint reports the configured project ID and maintenance status.

## Firebase migration

Follow [MIGRATION-README.md](./MIGRATION-README.md) before deploying. The CSV export does not contain QR token hashes or check-in history, so imported guests must recover their e-cards to receive new QR tokens.
