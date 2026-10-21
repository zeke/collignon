import { spawnSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";

const mode = process.argv[2];
if (!["production", "preview", "destroy"].includes(mode))
  throw new Error("Expected production, preview, or destroy.");
const account = process.env.CLOUDFLARE_ACCOUNT_ID;
const token = process.env.CLOUDFLARE_API_TOKEN;
if (!account || !token)
  throw new Error(
    "Deployment blocked: configure approved CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN first. No credentials are created or copied here.",
  );
const pr = process.env.PREVIEW_PR_NUMBER;
if (mode !== "production" && !/^[1-9]\d*$/.test(pr ?? ""))
  throw new Error("Positive PREVIEW_PR_NUMBER required.");
const name = mode === "production" ? "collignon" : `collignon-pr-${pr}`;
async function api(path) {
  const response = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok || !data.success)
    throw new Error(
      `Cloudflare inspection failed: ${path}, HTTP ${response.status}`,
    );
  return data.result;
}
if (mode === "production") {
  const zones = await api("/zones?name=ziki.boo");
  if (zones.length !== 1 || zones[0].account.id !== account)
    throw new Error("Authorized account must own ziki.boo.");
  const zone = zones[0].id;
  const domains = await api(`/accounts/${account}/workers/domains`);
  const assigned = domains.find(
    (item) => item.hostname === "collignon.ziki.boo",
  );
  if (assigned && assigned.service !== name)
    throw new Error(
      "Hostname belongs to another Worker; refusing to overwrite.",
    );
  const dns = await api(`/zones/${zone}/dns_records?name=collignon.ziki.boo`);
  if (dns.length && !assigned)
    throw new Error(
      "Existing hostname DNS requires review before modification.",
    );
  const routes = await api(`/zones/${zone}/workers/routes`);
  for (const route of routes) {
    const pattern = route.pattern
      .split("*")
      .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join(".*");
    const matcher = new RegExp(`^${pattern}$`);
    if (
      (matcher.test("https://collignon.ziki.boo/") ||
        matcher.test("collignon.ziki.boo/")) &&
      route.script !== name
    )
      throw new Error(
        "An existing Worker route covers this hostname; review required.",
      );
  }
  const workers = await api(`/accounts/${account}/workers/scripts`);
  if (workers.some((worker) => worker.id === name) && !assigned)
    throw new Error(
      "An existing collignon Worker requires ownership review before overwriting.",
    );
  const manifest = JSON.parse(
    await readFile("public/audio/manifest.json", "utf8").catch(() => "{}"),
  );
  if (!manifest.complete || manifest.samples?.length !== 4)
    throw new Error(
      "Production requires all four authorized OpenAI pronunciation samples first.",
    );
  for (const sample of manifest.samples)
    await readFile(`public/audio/${sample.id}.mp3`);
}
if (mode === "destroy") {
  // Direct API call: `wrangler delete` also lists KV namespaces, which the preview token cannot read.
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${account}/workers/scripts/${name}?force=true`,
    { method: "DELETE", headers: { Authorization: `Bearer ${token}` } },
  );
  if (!response.ok && response.status !== 404)
    throw new Error(`Preview deletion failed: HTTP ${response.status}`);
  console.log(response.ok ? `Deleted ${name}` : `${name} was already deleted`);
  process.exit(0);
}
const config = JSON.parse(await readFile("wrangler.jsonc", "utf8"));
config.name = name;
config.account_id = account;
config.workers_dev = mode !== "production";
config.preview_urls = false;
config.routes =
  mode === "production"
    ? [{ pattern: "collignon.ziki.boo", custom_domain: true }]
    : [];
config.assets.directory = "../public";
config.main = "../src/index.ts";
await mkdir(".wrangler", { recursive: true });
const path = `.wrangler/${name}.json`;
await writeFile(path, JSON.stringify(config, null, 2));
const result = spawnSync("npx", ["wrangler", "deploy", "--config", path], {
  stdio: "inherit",
});
process.exitCode = result.status ?? 1;
