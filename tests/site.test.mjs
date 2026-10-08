import { test } from "node:test";
import assert from "node:assert/strict";
import { waLink, CONTATO, EMPRESA } from "../src/data/site.mjs";

test("link do WhatsApp codifica acentos e espaços", () => {
  assert.equal(waLink("Olá, G-TECH!"), "https://wa.me/5563981212444?text=Ol%C3%A1%2C%20G-TECH!");
});
test("nenhum endereço residencial nos dados públicos", () => {
  const tudo = JSON.stringify({ CONTATO, EMPRESA });
  for (const proibido of ["***", "***", "***"]) assert.ok(!tudo.includes(proibido), proibido);
});
