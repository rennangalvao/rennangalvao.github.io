import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parseFeed, buscarVideos } from "../src/lib/youtube.mjs";

const xml = `<feed><entry><yt:videoId>abc123</yt:videoId><title>Mouse &amp; teclado: &quot;história&quot; 🖱️</title></entry>
<entry><yt:videoId>def456</yt:videoId><title>Segundo</title></entry></feed>`;

test("lê id, título decodificado, link e miniatura", () => {
  const [v] = parseFeed(xml);
  assert.deepEqual(v, {
    id: "abc123",
    titulo: "Mouse & teclado: \"história\" 🖱️",
    url: "https://www.youtube.com/watch?v=abc123",
    thumb: "https://i.ytimg.com/vi/abc123/hqdefault.jpg",
  });
});
test("respeita o limite", () => assert.equal(parseFeed(xml, 1).length, 1));
test("xml vazio ou quebrado vira lista vazia", () => {
  assert.deepEqual(parseFeed(""), []);
  assert.deepEqual(parseFeed("<feed><entry><title>sem id"), []);
});
test("falha de rede vira lista vazia, sem lançar", async () => {
  const semCache = join(mkdtempSync(join(tmpdir(), "yt-")), "nao-existe.json");
  assert.deepEqual(await buscarVideos("x", 6, async () => { throw new Error("offline"); }, semCache), []);
  assert.deepEqual(await buscarVideos("x", 6, async () => ({ ok: false, text: async () => "" }), semCache), []);
});
test("feed fora do ar usa a última lista boa", async () => {
  const cache = join(mkdtempSync(join(tmpdir(), "yt-")), "cache.json");
  const ok = await buscarVideos("x", 6, async () => ({ ok: true, text: async () => xml }), cache);
  assert.equal(ok.length, 2);
  assert.deepEqual(await buscarVideos("x", 1, async () => ({ ok: false, text: async () => "" }), cache), ok.slice(0, 1));
});
