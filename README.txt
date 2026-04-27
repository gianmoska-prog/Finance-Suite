MOSCATELLI FINANCIAL WORKSTATION v5.1

Open index.html in a browser.

Contents:
- index.html
- assets/css/styles.css
- assets/js/app.js
- assets/img/moscatelli-logo-ivory.png

Primary features:
- Threshold / index section
- Budget calculator with sub-tabs
- Academy skeleton
- Floating AI assistant placeholder
- CSV export
- JSON backup save/load
- localStorage persistence
- EN / IT / PT language dropdown
- Batch-linked production and packaging logic
- Returns, defects, packaging MOQ, sensitivity, batch comparison and loan modelling

Important:
- No API is connected.
- No API keys are stored.
- Financial figures remain assumptions until replaced with supplier quotes, physical samples, commercialista guidance and real buyer data.


V4.6 Academy beginner-proof patch:
- Academy reorganised into Start Here, Playbooks, Concepts, Launch Discipline, and Quick Reference.
- English, Italian, and Brazilian Portuguese Academy content rewritten for clearer daily operation.
- Current Plan guidance and direct preset buttons added inside relevant Academy lessons.
- Academy visual hierarchy strengthened for the operating user’s daily use.


v4.7 contextual help patch:
- Added delayed question-mark help icons across calculator cards, panels, input fields, loan fields, and summary rail.
- Help popover appears after a deliberate hover/focus and can be opened by click/tap.
- No calculation logic, state schema, input IDs, or STORAGE_KEY changed.


V4.8 contextual-help and neutral Academy patch:
- Expanded calculator help popovers with short examples.
- Removed person-specific Academy language.
- Reworked Italian and Portuguese Academy/action labels into neutral, unisex wording.

V4.8 notes:
- Contextual help now includes concise examples.
- Academy and help copy no longer refers to a specific team member.
- Italian and Portuguese user-facing guidance has been neutralised to avoid gendered operator wording.

V4.9 Netlify AI integration patch:
- Added Netlify Function support for AI scenario review.
- Added `netlify/functions/financial-review.js` and `netlify.toml`.
- Added a Netlify Function URL field inside the Financial Assistant panel.
- The OpenAI API key must be stored only in Netlify environment variables, never in the website, GitHub, localStorage, or backups.
- See NETLIFY_SETUP.md for the GitHub Pages + separate Netlify function workflow.


V5.1 Moscatelli Finance AI endpoint patch:
- Assistant panel is pre-filled with https://finance-suite-ai.netlify.app/.netlify/functions/financial-review.
- Netlify Function prompt is tuned as MOSCATELLI FINANCE AI: severe internal financial controller, refined tone, no flattery, no invented facts.
- Browser still does not store or expose the OpenAI API key. The key belongs only in Netlify environment variables.
- The only required Netlify secret remains OPENAI_API_KEY.


V5.1 Moscatelli Finance AI chat-console patch:
- Assistant now opens as a review console rather than an endpoint setup page.
- Netlify function URL is pre-linked internally to https://finance-suite-ai.netlify.app/.netlify/functions/financial-review.
- Endpoint settings remain available only under a discreet advanced section.
- Optional user instruction field added for custom AI review requests.
- No API key is stored in the website, GitHub, ZIP, localStorage, or backups.
