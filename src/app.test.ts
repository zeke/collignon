import assert from "node:assert/strict";
import { test } from "node:test";
import app from "./index";

test("the public page contains only the scoped conversation, accessible inline audio controls, and a source link", async () => {
  const response = await app.request("/");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /text\/html/);
  assert.match(
    response.headers.get("content-security-policy") ?? "",
    /media-src 'self'/,
  );
  assert.match(
    response.headers.get("content-security-policy") ?? "",
    /frame-src https:\/\/www\.youtube-nocookie\.com;/,
  );
  const html = await response.text();
  assert.match(html, /youtube-nocookie\.com\/embed\/vTbcPIKxmP0\?start=42/);
  assert.equal((html.match(/data-audio=/g) ?? []).length, 4);
  assert.equal(
    (html.match(/aria-label="Play French pronunciation:/g) ?? []).length,
    4,
  );
  assert.match(html, /lang="fr"/);
  assert.match(html, /Zeke/);
  assert.match(html, /dort/);
  assert.match(html, /href="https:\/\/github\.com\/zeke\/collignon"/);
  assert.doesNotMatch(html, /autoplay|<ul|<ol|<audio|api.openai.com|API_KEY/);
});

test("unknown URLs return 404 instead of leaking or rewriting files", async () => {
  assert.equal((await app.request("/.env")).status, 404);
  assert.equal((await app.request("/not-a-page")).status, 404);
});

test("audio requests use the static asset binding, with no generation endpoint", async () => {
  let requested = "";
  const env = {
    ASSETS: {
      fetch: async (request: Request) => {
        requested = new URL(request.url).pathname;
        return new Response("static sample", {
          headers: { "Content-Type": "audio/mpeg" },
        });
      },
    },
  } as Env;
  const response = await app.request("/audio/oignons.mp3", {}, env);
  assert.equal(response.status, 200);
  assert.equal(requested, "/audio/oignons.mp3");
  assert.equal(response.headers.get("content-type"), "audio/mpeg");
});
