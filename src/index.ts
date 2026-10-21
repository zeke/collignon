import { Hono } from "hono";
import { page } from "./page";

const app = new Hono<{ Bindings: Env }>();
app.use("*", async (c, next) => {
  await next();
  c.header("X-Content-Type-Options", "nosniff");
  c.header("Referrer-Policy", "strict-origin-when-cross-origin");
  c.header(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self'; style-src 'self'; media-src 'self'; frame-src https://www.youtube-nocookie.com; base-uri 'none'; frame-ancestors 'none'",
  );
});
app.get("/", (c) => c.html(page));
app.get("/audio/*", (c) => c.env.ASSETS.fetch(c.req.raw));
app.get("/style.css", (c) => c.env.ASSETS.fetch(c.req.raw));
app.get("/audio.js", (c) => c.env.ASSETS.fetch(c.req.raw));
app.notFound((c) => c.text("Not found", 404));
export default app;
