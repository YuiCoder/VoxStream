# Stripe

Stripe live is closed. Donations later. Stripe is not required.

Team Plus/Pro/Ultra is granted by the owner (`POST /v1/admin/grant`). Not a card.

`POST /v1/checkout` and `POST /v1/stripe/webhook` still exist in the binary. Without keys they return `501`. That is expected.

Do not print cents or prices on the Pages landing. Do not add live keys. Do not commit secrets.
