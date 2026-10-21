# Collignon

Hono Worker serving a single centered conversation page and static pronunciation assets.

- Run `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` before publishing.
- `src/phrases.ts` owns the four short film quotations. Keep all other copy original and scoped to this exchange.
- The page embeds the Collignon clip from YouTube via `youtube-nocookie.com` starting at 0:42. The CSP `frame-src` allows only that host.
- `public/audio` contains pregenerated OpenAI MP3s. Never call paid APIs during builds, deployments, previews, or visits.
- Generation requires explicit budget approval and an existing authorized `OPENAI_API_KEY`; never commit credentials.
- Deployment requires existing Cloudflare authentication. Approve any new persistent credential scope separately.
- The production deploy script alone adds collignon.ziki.boo. Preview Workers have unique names and no custom routes or shared resources.
- GitHub repository is private; the requested production site is public.
- Keep this file updated whenever meaningful project commands, conventions, or deployment details change.
