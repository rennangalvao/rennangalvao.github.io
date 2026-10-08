import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { waLink, CONTATO, EMPRESA } from "../src/data/site.mjs";

test("link do WhatsApp codifica acentos e espaços", () => {
  assert.equal(waLink("Olá, G-TECH!"), "https://wa.me/5563981212444?text=Ol%C3%A1%2C%20G-TECH!");
});

// Dados que nunca podem ir a público (ex.: endereço residencial do CNPJ). A lista fica em .privado,
// um termo por linha, fora do git — o repositório é público e não pode conter os próprios termos.
const PRIVADO = new URL("../.privado", import.meta.url);
const proibidos = existsSync(PRIVADO)
  ? readFileSync(PRIVADO, "utf8").split("\n").map((l) => l.trim()).filter(Boolean)
  : [];

function textosDe(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((nome) => {
    const p = join(dir, nome);
    if (statSync(p).isDirectory()) return textosDe(p);
    return /\.(html|xml|txt|json|css|js)$/.test(nome) ? [[p, readFileSync(p, "utf8")]] : [];
  });
}

test("nenhum dado privado nos dados nem no site montado", { skip: !proibidos.length && "sem .privado" }, () => {
  const fontes = [["dados", JSON.stringify({ CONTATO, EMPRESA })], ...textosDe("dist")];
  for (const [onde, texto] of fontes)
    for (const termo of proibidos) assert.ok(!texto.includes(termo), `"${termo}" encontrado em ${onde}`);
});
