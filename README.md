# TT Games

Studio site for TimmieTooth Games. English UI. HnT, Unremembered, and Waterdrop Survivor as a series. The account is a Tuffie.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000

The intro plays once per visit. Skip is in the corner. Sound sits in the menu.

## What is local

Seats, the egg, wishlist, the wall, the inbox, the den, sparring, and the desk are stored in this browser. They work with no accounts.

Supabase and Stripe turn on when the variables in `.env.example` are filled. Copy that file to `.env.local`. The shop accepts a Stripe **test** key (`sk_test_`) and refuses a live key.

Media URLs, roadmap rows, barks, and inbox notes are edited on `/desk` by the first seat on this machine, or by the email in `NEXT_PUBLIC_TT_OWNER_EMAIL`.

A trailer or still is a URL in the desk: `video https://…`, `still https://…`, or `build https://…` on the selected game. Empty gates are intentional.

## Waterdrop editions

Core is the 2 Oct 2026 public canvas build. Space Edition and Remnant are named and were not found in a repository. V4 Native is the private Godot scaffold. Sandbox is the THREE.js build in RasmusVersion. Earlier canvas repos are passes of Core, not extra editions.

## Free accounts still to create

- Supabase (free): https://supabase.com/dashboard/sign-up — then Auth providers for Google, and run `supabase/schema.sql` if you want the hosted tables. Apple sign-in is drawn and switched off.
- Stripe test mode (free, no live charges): https://dashboard.stripe.com/register — use a test secret key only.
- Vercel Hobby (free personal): https://vercel.com/signup — this folder was not deployed.

No custom domain, no Apple Developer program, no paid plan.
