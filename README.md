# Collignon

A small French pronunciation conversation inspired by the rhyming taunts in *Amélie*. Large centered type, plain English glosses, and phrases you can tap to hear.

Built with Hono for Cloudflare Workers. Intended public address: https://collignon.ziki.boo.

Only four short film lines are quoted. Commentary is original; no private conversation history is included. [Script source, printed page 24](https://www.languages.org.au/french/resources/Amelie_numbered_script_p19-20_edited.pdf#page=24).

Audio is designed to be generated once with OpenAI's `gpt-4o-mini-tts` and stock `coral` voice, then served as static MP3s. It is AI-generated, not film audio or a clone. Generation is currently pending authorized API access and a spending cap. No audio is generated during builds or page visits.

CI checks every PR and main push. Same-repository PRs get isolated Workers previews; merging to main deploys production after the same checks. Deployment workflows require an approved `CLOUDFLARE_API_TOKEN` secret and `CLOUDFLARE_ACCOUNT_ID` variable. Use separate environment credentials for `production` and `preview`, with environment protection rules appropriate to the repository. Neither is installed automatically. Missing credentials fail with an explicit setup message. Preview Workers carry no production domain or storage bindings.

Technical instructions: [AGENTS.md](AGENTS.md).
