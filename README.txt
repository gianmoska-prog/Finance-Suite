MOSCATELLI FINANCIAL WORKSTATION — v5.8 Mobile Compatibility Follow-up

This package contains the Moscatelli Financial Workstation as a GitHub-ready static site.

Core files:
- index.html
- assets/css/styles.css
- assets/js/app.js
- assets/img/moscatelli-logo-ivory.png

Key functions:
- Local calculator for the Terra Bruna / Bianco Avorio scarf launch.
- Current Plan preset.
- Academy operating manual.
- Contextual calculator help.
- JSON backup import/export.
- CSV export.
- Print/PDF view.
- EN / IT / PT language system.
- GPT Studio link for external analysis in ChatGPT.

V5.2 GPT Studio Link patch:
- Removed the embedded API assistant workflow from the website.
- Replaced the assistant console with a smooth link to the dedicated ChatGPT GPT:
  https://chatgpt.com/g/g-69ef716b64788191a51c8a6d3363acb6-moscatelli-financial-studio-assistant
- Added “Copy scenario brief & open GPT” behaviour.
- No API key is stored, requested, or used by the website.

Security note:
The website does not contain API keys. The GPT opens through ChatGPT directly.

Storage note:
The existing localStorage key remains unchanged for data safety:
moscatelliFinancialWorkstation.v31

v5.7 GPT Bridge
- Adds section-level “Copy information” buttons inside the calculator.
- Adds “Paste GPT Instruction” buttons that can apply a valid moscatelli-workstation-patch block copied from the custom GPT.
- Adds MOSCATELLI_FINANCIAL_STUDIO_GPT_INSTRUCTIONS.md with the recommended custom GPT instruction set.
- The GPT should only use the isolated patch block when it is creating values for the user to paste into the calculator. Normal analysis should remain normal prose.


v5.7 Mobile Compatibility Patch
- Hardens Paste GPT Instruction validation and wrong-section patch protection.
- Adds confirmation before loading Current Plan.
- Optimises the Leonardo floating button asset and improves launcher accessibility.
- Aligns visible app version while preserving localStorage key moscatelliFinancialWorkstation.v31.

Mobile compatibility patch:
- Refined phone/tablet layout, safer touch targets, mobile bottom-sheet contextual help, compact GPT bridge controls, and safe-area spacing for modern mobile browsers.
