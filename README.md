# Voltway Energy

E-commerce foundation for solar generators and whole-home backup systems.

## Included foundation

- Responsive catalog, search, guided system finder, cart, checkout and invoice-request UX
- Demo inventory kept in `app/page.tsx` and clearly marked for replacement
- PostgreSQL/Prisma data contract in `prisma/schema.prisma`
- Zod request schemas and a transaction-safe invoice-number helper
- Auth-aware customer/admin structure and Stripe-ready payment boundary

## Before production

1. Set values from `.env.example`, configure PostgreSQL, then run Prisma migrations.
2. Replace demo product data, shipping/tax calculation and provisional UI actions with server actions/API routes.
3. Configure Stripe Payment Intents and invoice payment links; do not handle raw card details.
4. Add access-control enforcement for customer and admin routes plus rate limiting for public forms.
