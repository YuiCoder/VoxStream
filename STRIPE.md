# STRIPE.md

Paper / test-mode products only. Not live. No live keys.

Checkout is not live (`POST /v1/checkout` returns 501).
The webhook is already 501 (`POST /v1/stripe/webhook`). No plan is written from Stripe yet.

Do not print these cents on the Pages landing.

## Test products (paper cents)

Same numbers as `server/plans.mjs` `priceTable()` defaults.

| Product | Test cents | Notes |
| --- | --- | --- |
| Plus | 1000 | paper / test. Extra filters. Not for sale. |
| Pro | 1900 | paper / test. Hosted TikTok. The SKU we sell later. |
| Ultra | 3900 | paper / test. Seats later. Not an API this week. |

Free has no cents. Free never needs an account.

These are fixtures for a future Stripe test Dashboard. They are not charges. They are not live prices.

## Out of scope

- Live Stripe keys
- Customer Portal
- Cards on GitHub Pages
- Putting cents (or any price) on `index.html`
