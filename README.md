# Oracle du Fa

Prototype full-stack prêt à héberger.

Generated on 2025-10-17.

## Structure
See project tree in repository. Frontend (React + Vite) and backend (Express) included.

## Quick start (dev)
1. `npm install`
2. In one terminal `npm run server` to start backend (port 4000).
3. In another terminal `npm run dev` to start frontend (Vite).

## Environment (.env)
Create `.env` in `server/` with:
```
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
PORT=4000
```

## Deployment
- Frontend: Vercel or Netlify.
- Backend: Render / Railway / Heroku / Vercel Serverless functions.

## Notes
- Stripe & Mobile Money integrations need real credentials.
- Replace placeholder Odù texts with authoritative content provided by your bokonon.


## Notes sur Stripe

Dans ce prototype, les clés Stripe sont laissées en placeholders dans `server/.env.example`.
- Pour tester, mettez vos clés de test dans `server/.env`.
- L'intégration côté front inclut des appels vers `/create-payment-intent` et une simulation de confirmation pour la démo.

