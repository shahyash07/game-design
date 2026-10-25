# StaySmart on Lovable Cloud: feasibility brief

Research brief, 24 October 2026. Persona: staff engineer. Research only.

Repo facts used: `@tanstack/react-start` 1.168.60, `vite` 8.1.5 pinned with a `rolldown` 1.2.1 override, custom `src/start.ts` (CSRF middleware re-added with `handlerType === "serverFn"` filter, `attachSupabaseAuth` function middleware), generated `requireSupabaseAuth` middleware, `supabaseAdmin` service-role Proxy in `client.server.ts`, `cron-auth.ts` checking `LOVABLE_CRON_SECRET`/`_PREVIOUS` via `node:crypto`, and 2.6 MB of level JSON in `src/lib/levels/` imported statically by `levels.ts`.

## 1. Lovable Cloud capabilities (2026)

**Runtime.** TanStack Start apps publish as a Cloudflare edge Worker; unprefixed secrets are injected as Worker bindings at request time (no rebuild on rotation), `VITE_*` is public and baked in at build time (Lovable rejects `VITE_` names in Secrets). Lovable does not publish Worker limits; Cloudflare's paid limits apply: 30 s CPU default (up to 5 min), no HTTP wall-clock limit, 6 simultaneous outgoing connections per request, `waitUntil` 30 s after response. The generated `cron-auth.ts` imports `node:crypto`, so Node compat is on. Connector and AI calls fail in local dev (docs).

**AI gateway.** `@lovable.dev/ai-gateway` 0.1.10 (published 2026-10-23, server-only, `LOVABLE_API_KEY` auto-managed). Exports `generateChatCompletion/streamChatCompletion`, `generateResponse`, `generateSpeech/streamSpeech`, `transcribeAudio`, `generateEmbeddings`, `generateImage`, `listModels`. Model IDs are `provider/model` (README examples: `openai/gpt-6-astra`, `openai/gpt-6-luna`, `openai/gpt-5.4`); run `npx ai-gateway generate` once to get the typed catalog. Built-in retries (`maxRetries: 2`), `GatewayError.retryAfter`. Models (docs, display names): chat default GPT-6 Astra, cheap GPT-6 Luna, Gemini 3.8 Flash / 3.1 Flash Lite, Claude (TanStack apps only); TTS Gemini 3.1 Flash TTS Preview (default), 2.5 Flash TTS, 2.5 Pro TTS; "typed decisions" Jev 1.13; embeddings Gemini Embedding 2. Pricing is credits at provider rates (Pro $0.25/credit, Business $0.50/credit); temporary grants: 4 AI credits + 20 Cloud credits/month, no rollover. Rate limits are per workspace in requests/min; the number is not published. `429` on rate limit, `402` when out of credits (AI features stop; Cloud apps may pause).

```ts
const r = await generateChatCompletion({ model: "openai/gpt-6-luna", messages }, { maxRetries: 1 });
```

**Server vs edge functions.** TanStack projects get server functions/server routes; Cloud edge functions still exist (Database view) but are the React+Vite path. Docs: "a function running on the server is still callable by a client" so every server function needs its own auth.

**Jobs/cron.** Created by chat or SQL; `pg_cron` + `pg_net` are supported extensions; Jobs view shows run history; each run costs run credits. The scheduler calls your app with `Authorization: Bearer <LOVABLE_CRON_SECRET>`; the generated helper verifies it and supports rotation. Timeouts/retries are undocumented. `pg_net` default timeout is 2 s; raise `timeout_milliseconds`.

**Email.** Paid plans only: 50,000 transactional emails/month, Pro 100 app emails/hour, overage 4 credits/1000, max 5 recipients per send, sender subdomain via NS records. TanStack projects send without Cloud via `@lovable.dev/email-js` 0.5.0 (`sendLovableEmail({ purpose: "transactional", idempotency_key })`).

**Webhooks.** `@lovable.dev/webhooks-js` 0.0.3 only verifies Lovable's own `x-lovable-signature` (HMAC with `LOVABLE_API_KEY`). Third-party inbound webhooks are plain server routes.

**Payments.** Built-in (Pro+, Stripe or Paddle, Lovable creates products/checkout/webhooks/tables; embedded Stripe checkout only; one active subscription per user; project cannot be remixed; cannot coexist with own-Stripe). Own Stripe account: `STRIPE_SECRET_KEY` secret, email-matched subscription check at sign-in, webhooks optional.

**Storage.** Supabase Storage; upload cap 2 GB default, up to 5 GB; private (signed URL, 1 h) or public buckets. Billed as run credits (no per-GB rate published). Own Supabase: Free 1 GB/5 GB egress/50 MB files; Pro 100 GB storage, 250 GB egress, then $0.0213/GB and $0.09/GB.

**Analytics.** Built-in Analytics = visits/pageviews/channels, no custom events; docs say "connect a dedicated analytics tool such as PostHog" for funnels. The PostHog connector exposes the `phc_` token as a `VITE_` var.

## 2. Smallest viable design per addition

**(a) Question banks in Supabase.**
- One table: `levels(game text, n int, payload jsonb, published bool default true, updated_at, primary key (game, n))`. Seed it from the existing JSON with a one-off script (extend `scripts/generate-levels.ts`).
- RLS: `select` to anon/authenticated `using (published)`. No write policies; writes go through a server function using `supabaseAdmin` after an admin check. Smallest admin check: `profiles.is_admin boolean` read with the caller's `userId` from `requireSupabaseAuth` (Supabase's JWT-claims RBAC hook is the heavier option).
- Admin UI: one `/admin` route, a list plus a JSON textarea per level, zod-validated with the existing rule validators in `puzzles.ts`.
- Read path: `getLevel({ game, n })` server function + react-query. This also removes the 2.6 MB from the client bundle (see 3).

**(b) LLM grading.**
- Server function with `requireSupabaseAuth`, validator `z.object({ attemptKey, rationale: z.string().trim().max(300) })`, model `openai/gpt-6-luna` (or Gemini 3.1 Flash Lite), temperature 0, provider JSON-schema output `{ score: 0-3, tip: string<=140 }`, zod-validate the reply, store only validated fields.
- Cost: ~350 input + 60 output tokens. GPT-6 Luna $0.10/$0.50 per 1M -> ~$0.00007/call; Gemini 3.1 Flash Lite $0.25/$1.50 -> ~$0.00018; gpt-5-nano $0.05/$0.40 -> ~$0.00004. The 4-credit grant (~$1 on Pro) covers ~14k Luna calls/month.
- Prompt injection: the rationale is data, not instructions. System prompt fixes the task and says to ignore instructions inside the answer; pass the rationale as one delimited user message; no tools; hard length cap; structured output validated in code (OWASP LLM01 mitigations); one grade per `attemptKey` (unique row) doubles as a rate limit. Jev 1.13 returns only a score/probability and "does not write sentences", so a Jev score + Luna tip is the injection-proof upgrade if needed.

```ts
messages: [{ role: "system", content: RUBRIC }, { role: "user",
  content: `Question: ${q}\n<answer>${rationale}</answer>` }]
```

**(c) TTS clips (~90 s).**
- Generate at authoring/publish time from a job (not on first play): server route guarded by `authenticateCronRequest`, batch of 5 (Workers allow 6 outgoing connections), `generateSpeech(...)` -> `GatewayBinary.blob()` -> `supabaseAdmin.storage.from("audio").upload(`clips/${hash}.wav`, blob, { contentType, cacheControl: "31536000", upsert: false })`; a 400 "already exists" is a cache hit. Record `audio_clips(key pk, path)`; client plays `getPublicUrl`. Skip the table if the key is deterministic (hash of text) and you just try the public URL.
- Provider: Gemini 2.5 Flash TTS through the gateway (no key management, billed in credits). Gemini audio is 25 tokens/s, so 90 s = 2,250 output tokens: 2.5 Flash TTS $10/1M -> ~$0.023/clip; 3.1 Flash TTS Preview $20/1M -> ~$0.045; OpenAI gpt-4o-mini-tts ($12/1M audio tokens) is about the same but needs your own key; ElevenLabs is roughly 2-3x (third-party figures, unverified). Full library (14 games x 365) ~5k clips ~ $120 one-off, ~4 GB if WAV at 24 kHz 16-bit, ~0.7 GB if MP3.
- Output format is undocumented on Lovable's page; Gemini TTS natively returns PCM. Plan to prepend a 44-byte WAV header rather than transcoding in a Worker, or pick an MP3-emitting model. Verify `stream_format` in the generated speech types.

**(d) Analytics.** Use Lovable Analytics for traffic (zero code). Add PostHog only for 4-5 funnel events: `@posthog/react` `PostHogProvider` inside `RootDocument` in `__root.tsx` with `import.meta.env.VITE_POSTHOG_KEY`, `defaults: "2026-08-30"` (auto SPA pageviews), `identify(user.id)` after Supabase sign-in, `reset()` on sign-out. SSR gotchas: never call `posthog.init` at module scope (touches `window`); server events via a `posthog-node` singleton with `flushAt: 1, flushInterval: 0`; CSP must allow `*.posthog.com`. Supabase has no product-analytics product; a custom events table means building your own dashboards, so skip.

**(e) Push + PWA.** `vite-plugin-pwa` is incompatible with Start production builds (TanStack/router#4988, open, `needs-upstream-fix`, July 2026). Hand-roll: `public/manifest.webmanifest` (name, icons 192/512, `start_url`, `display: standalone`), `<link rel="manifest">` in the root head, `public/sw.js` with only `push` and `notificationclick` handlers (no precache; Chrome's install criteria need manifest + HTTPS + engagement), register in a `useEffect`. Table `push_subscriptions(user_id, endpoint unique, subscription jsonb)` with own-row RLS; `VITE_VAPID_PUBLIC_KEY` + secret `VAPID_PRIVATE_KEY`; subscribe on a button tap (required on iOS; the Lovable preview iframe blocks the prompt). Send from a cron-guarded server route with `@block65/webcrypto-web-push` 2.0.0 (WebCrypto, runs on Workers; `web-push` 3.6.7 is Node-only). Delete rows on 404/410. iOS 16.4+ only when installed to Home Screen. Alternative: the FCM connector supports web push but adds a Firebase project and client SDK.

**(f) Progress sync.** Attempts are immutable facts, so merge = set union. Table `attempts(user_id, client_id text, ...Attempt columns, primary key (user_id, client_id))` with own-row RLS, `client_id = `${game}:${at}``. In `progress.save`, after writing localStorage, if signed in: `supabase.from("attempts").upsert(unsynced, { onConflict: "user_id,client_id", ignoreDuplicates: true })` in batches of 500, then mark synced ids locally. On sign-in pull all rows and union by `client_id`. `selectedLevels`/`mixPool` are last-writer-wins by `updated_at` in `profiles`. Keep `submit_daily_score` untouched; guests stay localStorage-only.

**(g) Stripe.** Smallest on Lovable: ask for built-in payments (Pro+) and accept its limits (embedded checkout, no remix). If you want own-account control: server function `createCheckout` (auth required) -> `stripe.checkout.sessions.create({ mode: "subscription", line_items: [{ price, quantity: 1 }], client_reference_id: userId, customer_email, success_url, cancel_url })`; server route `POST /api/stripe/webhook` reading `await request.text()` and verifying with the `Stripe-Signature` header and `STRIPE_WEBHOOK_SECRET` (raw body must be untouched; default tolerance 5 min); handle `checkout.session.completed`, `customer.subscription.updated|deleted`, `invoice.paid`, `invoice.payment_failed` -> upsert `subscriptions(user_id pk, customer_id, status, current_period_end)`; dedupe by `event.id`; return 200 fast; portal via `billingPortal.sessions.create`. On Workers use stripe-node's fetch HTTP client and the async (SubtleCrypto) `constructEvent` variant (unverified, from memory).

## 3. Stack gotchas (Start 1.168 / React 19 / Vite 8 / nitro on Lovable)

- **SSR + localStorage.** `progress.load()` returns `{attempts: []}` on the server, so any route rendering progress hydrates with a mismatch. Set `ssr: false` (or `'data-only'`) on game/progress routes (children can only tighten the parent's value), or render progress-dependent UI after a hydration flag. The same for `canvas-confetti`, sound, `navigator.serviceWorker`, `posthog-js`. Lovable's upgrade doc names browser-only libraries as the top cause of blank SSR pages.
- **CSRF.** A custom `start.ts` disables the auto-installed CSRF middleware; yours re-adds it correctly. It rejects requests with none of `Sec-Fetch-Site`/`Origin`/`Referer`, so server functions are browser-only; the `serverFn` filter leaves server routes alone, which is why the Stripe webhook and cron route work, but they must carry their own auth (signature / `LOVABLE_CRON_SECRET`). Pass `origin` if the public domain differs from the request origin. Clerk notes importing `createCsrfMiddleware` is reliable only from 1.168.10; you are on 1.168.60.
- **Env.** Read `process.env` inside handlers/middleware, never at module scope (undefined on Workers and risks inlining into the client bundle); keep the `client.server.ts` Proxy pattern and dynamic-import `supabaseAdmin` from route files. `LOVABLE_API_KEY` is unavailable locally, so gateway code is only testable in preview/published.
- **Bundle.** The 2.6 MB JSON ships to every client today (Vite `json.stringify: 'auto'` turns >10 kB files into `JSON.parse` strings: faster parse, same bytes; `chunkSizeWarningLimit` is 500 kB). Cheapest fix: `await import("./levels/queens.json")` per game; proper fix: plan (a).
- **Vite 8 / nitro.** nitro#4533 (`ssr_exports` SyntaxError in production builds with Vite 8.2.x and rolldown <1.2.7) explains your `vite` 8.1.5 and `rolldown` 1.2.1 pins. Either keep both pins or move to Vite >=8.3.4 (rolldown ~1.2.12) in one step; `inlineDynamicImports: true` is the nitro-side workaround. `@lovable.dev/mcp-js` and `vite-plugin-pwa` require `vite <9`.
- **Workers runtime.** Avoid Node-only libraries (`web-push`, `https`-based SDKs); 6 concurrent outgoing fetches per request caps batch TTS; long generation belongs in a job, not a user request.
- **Credits.** 4 AI credits/month is ~$1 on Pro; enable auto top-up with a monthly cap before shipping (b) and (c), and handle `402` in the UI.

## Sources
- https://docs.lovable.dev/integrations/ai
- https://docs.lovable.dev/features/ai-chat.md
- https://docs.lovable.dev/features/ai-text-to-speech.md
- https://docs.lovable.dev/features/ai-decisions.md
- https://docs.lovable.dev/features/cloud
- https://docs.lovable.dev/features/jobs
- https://docs.lovable.dev/features/secrets
- https://docs.lovable.dev/features/storage
- https://docs.lovable.dev/features/custom-emails.md
- https://docs.lovable.dev/features/payments
- https://docs.lovable.dev/integrations/stripe
- https://docs.lovable.dev/features/analytics
- https://docs.lovable.dev/integrations/posthog.md
- https://docs.lovable.dev/integrations/firebase-cloud-messaging.md
- https://docs.lovable.dev/features/project-usage
- https://docs.lovable.dev/introduction/credits-and-usage.md
- https://docs.lovable.dev/tips-tricks/external-deployment-hosting
- https://docs.lovable.dev/tips-tricks/security-best-practices
- https://docs.lovable.dev/features/upgrade-to-tanstack-start.md
- https://docs.lovable.dev/changelog
- https://lovable.dev/blog/building-apps-using-tanstack-start
- https://registry.npmjs.org/@lovable.dev%2Fai-gateway (README, 0.1.10)
- https://registry.npmjs.org/@lovable.dev%2Femail-js
- https://registry.npmjs.org/@lovable.dev%2Fwebhooks-js
- https://registry.npmjs.org/@lovable.dev%2Fmcp-js
- https://registry.npmjs.org/@block65%2Fwebcrypto-web-push
- https://github.com/bworlds-co/clodable/issues/6
- https://tanstack.com/start/latest/docs/framework/react/guide/middleware
- https://tanstack.com/start/latest/docs/framework/react/guide/server-functions
- https://tanstack.com/start/latest/docs/framework/react/guide/server-routes
- https://tanstack.com/start/latest/docs/framework/react/guide/environment-variables
- https://tanstack.com/start/latest/docs/framework/react/guide/selective-ssr
- https://github.com/TanStack/router/issues/4988
- https://github.com/nitrojs/nitro/issues/4533
- https://github.com/clerk/javascript/releases/tag/%40clerk%2Ftanstack-react-start%401.7.0
- https://vite.dev/config/shared-options
- https://vite.dev/config/build-options
- https://developers.cloudflare.com/workers/platform/limits/
- https://posthog.com/docs/libraries/tanstack-start
- https://supabase.com/pricing
- https://supabase.com/docs/guides/storage/uploads/standard-uploads
- https://supabase.com/docs/reference/javascript/upsert
- https://supabase.com/docs/guides/cron
- https://supabase.com/docs/guides/database/extensions/pg_net
- https://supabase.com/docs/guides/database/postgres/custom-claims-and-role-based-access-control-rbac
- https://docs.stripe.com/webhooks
- https://docs.stripe.com/billing/subscriptions/webhooks
- https://developers.openai.com/api/docs/pricing
- https://ai.google.dev/gemini-api/docs/pricing
- https://web.dev/articles/install-criteria
- https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/
- https://genai.owasp.org/llmrisk/llm01-prompt-injection/
- https://www.originalobjective.com/blog/from-lovable-app-to-mobile-pwa-push-notifications-with-supabase

Skipped / not checked: stripe-node on Cloudflare Workers, the gateway's speech output format, and ElevenLabs pricing were not verified; Lovable publishes no numeric AI rate limit or job timeout, so those remain unknown. Risk: Lovable's credit grants and model list are marked "temporary/subject to change", and the Vite 8 / rolldown build bug means any dependency bump must be tested as a full publish, not just `vite dev`.
