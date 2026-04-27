# Moscatelli Financial Workstation — Netlify AI Function Setup

This package is prepared for the path where the website remains on GitHub/GitHub Pages and Netlify is used separately for the secure AI function.

## What is included

- `netlify/functions/financial-review.js` — serverless Netlify Function that calls OpenAI.
- `netlify.toml` — tells Netlify where the function lives.
- The website AI assistant panel now accepts a Netlify Function URL, for example:

```text
https://finance-suite-ai.netlify.app/.netlify/functions/financial-review
```

## Required Netlify environment variables

In Netlify, set these under Project configuration → Environment variables:

```text
OPENAI_API_KEY = your OpenAI API key
OPENAI_MODEL = gpt-5.5
MFW_ALLOWED_ORIGINS = https://YOUR-GITHUB-USERNAME.github.io
```

`OPENAI_MODEL` is optional. If absent, the function uses `gpt-5.5`.

`MFW_ALLOWED_ORIGINS` is recommended. Use your exact GitHub Pages origin. For quick testing, you can omit it and the function will allow all origins, but this is less controlled.

## How to use with GitHub Pages

1. Push this full folder to GitHub.
2. Keep GitHub Pages as the website host if preferred.
3. Create a separate Netlify project connected to the same repo, or a small repo containing only the `netlify/` folder and `netlify.toml`.
4. Set the Netlify environment variables above.
5. Deploy on Netlify.
6. Copy the function URL from Netlify:

```text
https://finance-suite-ai.netlify.app/.netlify/functions/financial-review
```

7. Open the workstation on GitHub Pages.
8. Open the Financial Assistant panel.
9. The workstation is already pre-filled with the finance-suite-ai endpoint. Paste a different URL only if the Netlify site name changes.
10. Click “Ask AI for financial review”.

## Security rules

- Never put `OPENAI_API_KEY` in `index.html`, `assets/js/app.js`, GitHub, localStorage, or JSON backups.
- The browser sends only scenario data to the Netlify Function.
- The Netlify Function reads the API key from Netlify environment variables.
- Do not paste bank data, tax codes, private contracts, or API keys into the workstation.


## v5.0 pre-linked endpoint

The workstation assistant is now pre-linked to:

```text
https://finance-suite-ai.netlify.app/.netlify/functions/financial-review
```

You do not need to paste this URL manually unless the Netlify site name changes.

Required Netlify variables remain:

```text
OPENAI_API_KEY = your OpenAI key
OPENAI_MODEL = gpt-5.5
MFW_ALLOWED_ORIGINS = https://gianmoska-prog.github.io
```

The OpenAI API key must never be committed to GitHub or placed inside the website files.
