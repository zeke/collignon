import { phrases } from "./phrases";

export const question =
  "In the movie Amélie, there’s a scene where the shopkeeper’s assistant and the artist are making up funny insults for the shop owner, whose name is Collignon. Can you look up what those actual insults are, say them in French, and tell me the English translations?";
const phrase = (index: number) => {
  const p = phrases[index];
  return `<span role="button" tabindex="0" lang="fr" data-audio="${p.id}" aria-label="Play French pronunciation: ${p.french}" aria-pressed="false">${p.french}</span>`;
};
export const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="A little conversation about the rhyming French taunts in Amélie.">
<title>Collignon</title>
<link rel="stylesheet" href="/style.css">
<script src="/audio.js" defer></script>
</head>
<body>
<div class="video">
<iframe src="https://www.youtube-nocookie.com/embed/vTbcPIKxmP0?start=42" title="Amélie (2001): Collignon, Dead and Gone" allow="encrypted-media; picture-in-picture; fullscreen" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>
<main>
<section aria-labelledby="zeke">
<h2 id="zeke" class="speaker">Zeke</h2>
<h1>${question}</h1>
</section>
<section aria-labelledby="dort" class="reply">
<h2 id="dort" class="speaker">dort</h2>
<p>They’re little rhymes aimed at Collignon.</p>
<p>${phrase(0)} is an invented rhyming taunt: <span lang="fr">crêpe</span> means pancake and <span lang="fr">chignon</span> means a hair bun. The joke is the sound.</p>
<p>${phrase(1)} means “Collignon, arse-face.” <span lang="fr">Fion</span> is vulgar slang for the backside.</p>
<p>${phrase(2)} means “Collignon, a punchable face.” A <span lang="fr">gnon</span> is a punch or a knock, so literally it’s a head for punches.</p>
<p>And ${phrase(3)} simply means “Collignon eats onions.” An ordinary sentence becomes a childish taunt because it rhymes.</p>
</section>
<p id="audio-status" role="status" aria-live="polite"></p>
<footer>
<a href="https://github.com/zeke/collignon" aria-label="Source code on GitHub"><svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill="currentColor" d="M10.226 17.284c-2.965-.36-5.054-2.493-5.054-5.256 0-1.123.404-2.336 1.078-3.144-.292-.741-.247-2.314.09-2.965.898-.112 2.111.36 2.83 1.01.853-.269 1.752-.404 2.853-.404 1.1 0 1.999.135 2.807.382.696-.629 1.932-1.1 2.83-.988.315.606.36 2.179.067 2.942.72.854 1.101 2 1.101 3.167 0 2.763-2.089 4.852-5.098 5.234.763.494 1.28 1.572 1.28 2.807v2.336c0 .674.561 1.056 1.235.786 4.066-1.55 7.255-5.615 7.255-10.646C23.5 6.188 18.334 1 11.978 1 5.62 1 .5 6.188.5 12.545c0 4.986 3.167 9.12 7.435 10.669.606.225 1.19-.18 1.19-.786V20.63a2.9 2.9 0 0 1-1.078.224c-1.483 0-2.359-.808-2.987-2.313-.247-.607-.517-.966-1.034-1.033-.27-.023-.359-.135-.359-.27 0-.27.45-.471.898-.471.652 0 1.213.404 1.797 1.235.45.651.921.943 1.483.943.561 0 .92-.202 1.437-.719.382-.381.674-.718.944-.943"/></svg></a>
</footer>
</main>
</body>
</html>`;
