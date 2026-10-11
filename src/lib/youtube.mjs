// Lê o feed RSS público do canal no build. Nunca lança: sem feed, usa a última lista boa (o feed do
// YouTube às vezes dá 404 por horas) e, sem ela, o site sai sem a lista de vídeos.
import { readFileSync, writeFileSync } from "node:fs";

const ENT = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'", "&apos;": "'" };
const decod = (s) => s.replace(/&(amp|lt|gt|quot|apos|#39);/g, (m) => ENT[m]);

export function parseFeed(xml, limite = 6) {
  const out = [];
  for (const [, e] of (xml || "").matchAll(/<entry>([\s\S]*?)<\/entry>/g)) {
    const id = e.match(/<yt:videoId>([\w-]+)<\/yt:videoId>/)?.[1];
    const titulo = e.match(/<title>([\s\S]*?)<\/title>/)?.[1];
    if (!id || !titulo) continue;
    out.push({
      id,
      titulo: decod(titulo.trim()),
      url: `https://www.youtube.com/watch?v=${id}`,
      thumb: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    });
    if (out.length >= limite) break;
  }
  return out;
}

export async function buscarVideos(channelId, limite = 6, fetchFn = fetch, cache = ".videos-cache.json") {
  let videos = [];
  try {
    const r = await fetchFn(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);
    if (r.ok) videos = parseFeed(await r.text(), limite);
  } catch {}
  try {
    if (videos.length) writeFileSync(cache, JSON.stringify(videos));
    else videos = JSON.parse(readFileSync(cache, "utf8")).slice(0, limite);
  } catch {}
  return Array.isArray(videos) ? videos : [];
}
