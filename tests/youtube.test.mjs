import { test } from "node:test";
import assert from "node:assert/strict";
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
  assert.deepEqual(await buscarVideos("x", 6, async () => { throw new Error("offline"); }), []);
  assert.deepEqual(await buscarVideos("x", 6, async () => ({ ok: false, text: async () => "" })), []);
});
