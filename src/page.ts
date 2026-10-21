import { phrases } from "./phrases";

export const question =
  "In the movie Amélie, there’s a scene where the shopkeeper’s assistant and the artist are making up funny insults for the shop owner, whose name is Collignon. Can you look up what those actual insults are, say them in French, and tell me the English translations? I don’t know what they are.";
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
<main>
<section aria-labelledby="zeke">
<h2 id="zeke" class="speaker">Zeke</h2>
<h1>${question}</h1>
</section>
<section aria-labelledby="dort" class="reply">
<h2 id="dort" class="speaker">dort</h2>
<p>They’re little rhymes aimed at Collignon. ${phrase(0)} is an invented rhyming taunt: <span lang="fr">crêpe</span> means pancake and <span lang="fr">chignon</span> means a hair bun. The joke is the sound. ${phrase(1)} means “Collignon, arse-face.” <span lang="fr">Fion</span> is vulgar slang for the backside.</p>
<p>${phrase(2)} means “Collignon, a punchable face.” A <span lang="fr">gnon</span> is a punch or a knock, so literally it’s a head for punches. And ${phrase(3)} simply means “Collignon eats onions.” An ordinary sentence becomes a childish taunt because it rhymes.</p>
</section>
<p id="audio-status" role="status" aria-live="polite"></p>
<footer>
<p>Tap underlined French to hear it.</p>
<p id="audio-disclosure">OpenAI AI-generated pronunciation is pending. No film audio or voice clone.</p>
<p>Short quotations from <i>Amélie</i> (2001). <a href="https://www.languages.org.au/french/resources/Amelie_numbered_script_p19-20_edited.pdf#page=24">Script, printed p. 24</a>. The script writes “crêpe chignon” without a hyphen. Explanations are paraphrased.</p>
</footer>
</main>
</body>
</html>`;
