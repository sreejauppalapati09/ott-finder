<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1nom3xbMspk3QvfZyH97tr0UkZEjoY5ZI

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Copy [.env.local.example](.env.local.example) to `.env.local` and fill in:
   - `ANTHROPIC_API_KEY` - your Anthropic (Claude) API key
   - `VITE_TMDB_API_KEY` - your TMDB API key (get one at https://www.themoviedb.org/settings/api)
3. Run the app:
   `npm run dev`
