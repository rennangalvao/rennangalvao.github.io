# Site G-TECH System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Landing page Astro da G-TECH System em https://rennangalvao.github.io/ que leva o visitante ao WhatsApp e mostra o canal Tech Curioso.

**Architecture:** Projeto Astro estático (template basics) criado no cortex com `new-project.sh`. Conteúdo fixo em `src/data/site.mjs`; vídeos do canal lidos no build pelo feed RSS público (`src/lib/youtube.mjs`, sem dependência, com fallback vazio). Deploy por GitHub Actions no repositório `rennangalvao/rennangalvao.github.io`, em todo push e todo dia.

**Tech Stack:** Astro 7 (TypeScript strict do template), CSS puro, node:test (testes sem dependência), GitHub Actions + GitHub Pages.

**Spec:** `/storage/projects/developer/projects-index/specs/2026-10-08-site-gtech-design.md` (cortex)

## Global Constraints
- Pasta do projeto: `/storage/projects/developer/gtech-site` (cortex). Todos os comandos rodam lá via `ssh cortex`.
- Site: `https://rennangalvao.github.io/` · repositório `rennangalvao/rennangalvao.github.io` (público) · push com o `gh` do cortex.
- Nome: **G-TECH System**. Razão social: G-TECH AUTOMACAO E SISTEMAS LTDA · CNPJ 68.816.887/0001-24.
- WhatsApp: `+55 63 98121-2444` → `https://wa.me/5563981212444?text=` + mensagem `Olá, G-TECH! Vim pelo site e quero um orçamento.` (codificada).
- E-mail: `gtech.instrumentacao@gmail.com` (assunto `Orçamento pelo site`).
- Endereço público: **só "Palmas/TO"** (o do CNPJ é residencial). Nunca rua/número/CEP no site nem no JSON-LD.
- Canal: Tech Curioso, `https://www.youtube.com/@gtechcurioso`, channel_id `UC9NiI-ewQ-U4XrKaqHIH26Q`.
- Projetos sem nome de cliente.
- Sem JS de framework no cliente; sem dependências novas no runtime.
- Copy PT-BR direta, sem jargão ("soluções inovadoras", "de ponta", "alavancar" proibidos).
- Lighthouse mobile ≥ 90 em Performance, Acessibilidade, Boas práticas e SEO.

## Review Focus
1. Feed do YouTube fora do ar / vazio / XML quebrado → build passa e a seção mostra só "Ver o canal" (teste em Task 2).
2. Título de vídeo com `&amp;`, `&quot;`, aspas, emoji → aparece decodificado e escapado, sem HTML injetado (teste em Task 2).
3. Link do WhatsApp com acentos e espaços na mensagem → `encodeURIComponent` correto (teste em Task 2).
4. Tela de 360 px → nada estoura na horizontal; botão flutuante não cobre o rodapé (verificação visual em Task 6).
5. Navegação só por teclado → foco visível em todos os links/botões; link "Pular para o conteúdo" (Task 4/6).

---

### Task 1: Projeto, repositório e identidade

**Files:**
- Create (via script): `/storage/projects/developer/gtech-site/` (template Astro basics)
- Delete: `src/components/Welcome.astro`, `src/assets/astro.svg`, `src/assets/background.svg` (órfãos do template)
- Create: `public/logo.png` (avatar do canal, 512 px), `docs/superpowers/specs/2026-10-08-site-gtech-design.md`, `docs/superpowers/plans/2026-10-08-site-gtech-plan.md`
- Modify: `astro.config.mjs`

**Interfaces:** Produces: projeto que builda (`npm run build` → `dist/`), `site: 'https://rennangalvao.github.io'`.

- [ ] **Step 1:** `ssh cortex 'cd /storage/projects/developer/Specter && ./new-project.sh astro gtech-site'` — esperar "✓".
- [ ] **Step 2:** Copiar spec e plano para `docs/superpowers/` do projeto.
- [ ] **Step 3:** Baixar o avatar do canal: `channels.list(part=snippet, id=UC9NiI-ewQ-U4XrKaqHIH26Q)` com o token do publicador → `snippet.thumbnails.high.url` (trocar `=s800` se vier `=s88`) → `public/logo.png`.
- [ ] **Step 4:** `astro.config.mjs`:
```js
// @ts-check
import { defineConfig } from 'astro/config';
export default defineConfig({ site: 'https://rennangalvao.github.io' });
```
- [ ] **Step 5:** Remover arquivos do template listados acima; `npm run build` → sucesso.
- [ ] **Step 6:** Commit `chore: projeto Astro do site G-TECH System`.

### Task 2: Dados do site e leitor do feed (com testes)

**Files:**
- Create: `src/data/site.mjs`, `src/lib/youtube.mjs`, `tests/site.test.mjs`, `tests/youtube.test.mjs`
- Modify: `package.json` (script `"test": "node --test tests/"`)

**Interfaces:**
- Produces: `site.mjs` exporta `EMPRESA`, `CONTATO` ({ whatsapp, whatsappLink, email, emailLink }), `waLink(msg: string): string`, `AMBIENTES`, `SERVICOS`, `PROJETOS`, `CANAL` ({ nome, url, inscrever, channelId }).
- Produces: `youtube.mjs` exporta `parseFeed(xml: string, limite = 6): {id, titulo, url, thumb}[]` e `buscarVideos(channelId: string, limite = 6, fetchFn = fetch): Promise<...[]>` (nunca lança; erro → `[]`).

- [ ] **Step 1: Testes que falham** — `tests/youtube.test.mjs`:
```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseFeed, buscarVideos } from '../src/lib/youtube.mjs';

const xml = `<feed><entry><yt:videoId>abc123</yt:videoId><title>Mouse &amp; teclado: &quot;história&quot; 🖱️</title></entry>
<entry><yt:videoId>def456</yt:videoId><title>Segundo</title></entry></feed>`;

test('lê id, título decodificado, link e miniatura', () => {
  const [v] = parseFeed(xml);
  assert.deepEqual(v, { id: 'abc123', titulo: 'Mouse & teclado: "história" 🖱️',
    url: 'https://www.youtube.com/watch?v=abc123', thumb: 'https://i.ytimg.com/vi/abc123/hqdefault.jpg' });
});
test('respeita o limite', () => assert.equal(parseFeed(xml, 1).length, 1));
test('xml vazio ou quebrado vira lista vazia', () => {
  assert.deepEqual(parseFeed(''), []);
  assert.deepEqual(parseFeed('<feed><entry><title>sem id'), []);
});
test('falha de rede vira lista vazia, sem lançar', async () => {
  assert.deepEqual(await buscarVideos('x', 6, async () => { throw new Error('offline'); }), []);
  assert.deepEqual(await buscarVideos('x', 6, async () => ({ ok: false, text: async () => '' })), []);
});
```
`tests/site.test.mjs`:
```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { waLink, CONTATO, EMPRESA } from '../src/data/site.mjs';

test('link do WhatsApp codifica acentos e espaços', () => {
  assert.equal(waLink('Olá, G-TECH!'), 'https://wa.me/5563981212444?text=Ol%C3%A1%2C%20G-TECH!');
});
test('nenhum endereço residencial nos dados públicos', () => {
  const tudo = JSON.stringify({ CONTATO, EMPRESA });
  for (const proibido of ['***', '***', '***']) assert.ok(!tudo.includes(proibido), proibido);
});
```
- [ ] **Step 2:** `npm test` → FAIL (módulos não existem).
- [ ] **Step 3: Implementar** `src/lib/youtube.mjs`:
```js
// Lê o feed RSS público do canal no build. Nunca lança: sem feed, o site sai sem a lista de vídeos.
const ENT = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&apos;': "'" };
const decod = (s) => s.replace(/&(amp|lt|gt|quot|apos|#39);/g, (m) => ENT[m]);

export function parseFeed(xml, limite = 6) {
  const out = [];
  for (const [, e] of (xml || '').matchAll(/<entry>([\s\S]*?)<\/entry>/g)) {
    const id = e.match(/<yt:videoId>([\w-]+)<\/yt:videoId>/)?.[1];
    const titulo = e.match(/<title>([\s\S]*?)<\/title>/)?.[1];
    if (!id || !titulo) continue;
    out.push({ id, titulo: decod(titulo.trim()), url: `https://www.youtube.com/watch?v=${id}`,
      thumb: `https://i.ytimg.com/vi/${id}/hqdefault.jpg` });
    if (out.length >= limite) break;
  }
  return out;
}

export async function buscarVideos(channelId, limite = 6, fetchFn = fetch) {
  try {
    const r = await fetchFn(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);
    return r.ok ? parseFeed(await r.text(), limite) : [];
  } catch {
    return [];
  }
}
```
`src/data/site.mjs` (conteúdo completo — copy final):
```js
export const EMPRESA = {
  nome: 'G-TECH System',
  razao: 'G-TECH AUTOMACAO E SISTEMAS LTDA',
  cnpj: '68.816.887/0001-24',
  cidade: 'Palmas/TO',
  atendimento: 'Presencial em Palmas e no Tocantins · remoto em todo o Brasil',
};
const FONE = '5563981212444';
export const waLink = (msg) => `https://wa.me/${FONE}?text=${encodeURIComponent(msg)}`;
export const CONTATO = {
  whatsapp: '(63) 98121-2444',
  whatsappLink: waLink('Olá, G-TECH! Vim pelo site e quero um orçamento.'),
  email: 'gtech.instrumentacao@gmail.com',
  emailLink: 'mailto:gtech.instrumentacao@gmail.com?subject=' + encodeURIComponent('Orçamento pelo site'),
};
export const AMBIENTES = [
  { titulo: 'Indústria', itens: ['Instrumentação e calibração', 'CLP e painéis de comando', 'Monitoramento de processo'] },
  { titulo: 'Subestações', itens: ['Supervisão e alarmes', 'Coleta de medições', 'Relatórios automáticos'] },
  { titulo: 'Escritórios', itens: ['Sistemas sob medida', 'Rotinas automatizadas', 'Atendimento por WhatsApp'] },
  { titulo: 'Casas', itens: ['Automação residencial', 'Câmeras e sensores', 'Controle pelo celular'] },
];
export const SERVICOS = [
  { titulo: 'Instrumentação e automação industrial', texto: 'Instalação, calibração e integração de instrumentos, CLPs e painéis para o processo rodar sem surpresa.' },
  { titulo: 'Software sob encomenda', texto: 'Sistemas, painéis e aplicativos feitos para o jeito que a sua empresa trabalha.' },
  { titulo: 'Automação com IA', texto: 'Robôs de WhatsApp e Telegram e fluxos no n8n que respondem, avisam e organizam sozinhos.' },
  { titulo: 'Sites e páginas de venda', texto: 'Sites rápidos, que aparecem no Google e levam o cliente direto para o seu contato.' },
];
export const PROJETOS = [
  { titulo: 'Agenda online de barbearia', texto: 'O cliente marca o horário pelo site e o pedido chega na hora no WhatsApp do barbeiro.' },
  { titulo: 'Delivery atendido por IA', texto: 'Robô no WhatsApp que mostra o cardápio, responde dúvidas e calcula a taxa de entrega pela localização.' },
  { titulo: 'Pagamentos via PIX automatizados', texto: 'Sistema que recebe, confere e registra cada pagamento sem trabalho manual.' },
  { titulo: 'Canal de vídeos que se produz sozinho', texto: 'Roteiro, narração, edição e publicação diária feitos por IA — é o Tech Curioso, logo abaixo.' },
];
export const CANAL = {
  nome: 'Tech Curioso',
  url: 'https://www.youtube.com/@gtechcurioso',
  inscrever: 'https://www.youtube.com/@gtechcurioso?sub_confirmation=1',
  channelId: 'UC9NiI-ewQ-U4XrKaqHIH26Q',
};
```
`package.json` → `"scripts": { ..., "test": "node --test tests/" }`.
- [ ] **Step 4:** `npm test` → 6 testes PASS.
- [ ] **Step 5:** Commit `feat: dados do site e leitor do feed do canal`.

### Task 3: Layout, SEO e identidade visual

**Files:**
- Modify: `src/layouts/Layout.astro` (substituir o do template)
- Create: `src/styles/global.css`, `public/robots.txt`, `public/sitemap.xml`, `public/og.png` (1200x630, gerado por Playwright do venv devppe)

**Interfaces:** Consumes `EMPRESA`, `CONTATO`, `CANAL`. Produces `<Layout title description>` com `<slot />`.

- [ ] **Step 1:** `Layout.astro`: `<html lang="pt-BR">`, `<title>`, meta description, canonical `new URL('/', Astro.site)`, Open Graph (`og:title`, `og:description`, `og:image` absoluto `/og.png`, `og:type=website`, `og:locale=pt_BR`), `theme-color`, favicon `/logo.png`, fontes Google (Inter 500/700/900, JetBrains Mono 500, `display=swap`, preconnect), JSON-LD:
```js
{ '@context': 'https://schema.org', '@type': 'LocalBusiness', name: 'G-TECH System',
  legalName: EMPRESA.razao, url: Astro.site.href, logo: new URL('/logo.png', Astro.site).href,
  telephone: '+55-63-98121-2444', email: CONTATO.email,
  address: { '@type': 'PostalAddress', addressLocality: 'Palmas', addressRegion: 'TO', addressCountry: 'BR' },
  areaServed: ['Palmas', 'Tocantins', 'Brasil'], sameAs: [CANAL.url] }
```
Link `<a class="pular" href="#conteudo">Pular para o conteúdo</a>` visível no foco; `<main id="conteudo"><slot /></main>`.
- [ ] **Step 2:** `global.css`: tokens `--bg:#0b1018; --sup:#121926; --borda:#223047; --txt:#eef2f7; --sec:#a4b0c2; --azul:#1f8fff; --agua:#19c2b0;` (conferir contra a logo e ajustar só os dois acentos), reset leve, `:focus-visible{outline:3px solid var(--agua);outline-offset:3px}`, container `max-width:1120px;padding-inline:16px`, botões (`.btn`, `.btn-whats` verde WhatsApp #25d366 com texto escuro para contraste AA), cartões, grid responsivo `repeat(auto-fit,minmax(240px,1fr))`, `img{max-width:100%;height:auto}`, sem overflow horizontal.
- [ ] **Step 3:** `robots.txt` (`User-agent: *` / `Allow: /` / `Sitemap: https://rennangalvao.github.io/sitemap.xml`) e `sitemap.xml` com a URL raiz.
- [ ] **Step 4:** Gerar `og.png` (fundo `--bg`, logo, "G-TECH System", frase principal) com Playwright.
- [ ] **Step 5:** `npm run build` → sucesso; `grep -c 'application/ld+json' dist/index.html` → 1. Commit `feat: layout, SEO e identidade`.

### Task 4: Seções da página

**Files:**
- Create: `src/components/Hero.astro`, `Ambientes.astro`, `Servicos.astro`, `Projetos.astro`, `Canal.astro`, `QuemSomos.astro`, `Contato.astro`, `WhatsFlutuante.astro`
- Modify: `src/pages/index.astro`

**Interfaces:** Consumes tudo de `site.mjs` e `buscarVideos` (Task 2). `Canal.astro` recebe `videos` como prop.

- [ ] **Step 1:** `index.astro` (frontmatter): `const videos = await buscarVideos(CANAL.channelId, 6);` e monta as seções na ordem do spec dentro de `<Layout title="G-TECH System · Software e automação em Palmas/TO" description="Instrumentação, automação industrial, software sob encomenda, bots com IA e sites. Palmas/TO e todo o Brasil. Peça seu orçamento pelo WhatsApp.">`.
- [ ] **Step 2:** `Hero`: único `<h1>` "Software e automação do chão de fábrica à sua casa", subtítulo com `EMPRESA.atendimento`, `<a class="btn btn-whats" href={CONTATO.whatsappLink} rel="noopener" target="_blank">Pedir orçamento no WhatsApp</a>` e `<a class="btn" href="#servicos">Ver o que fazemos</a>`, logo com `alt="G-TECH System"`, `width/height` fixos.
- [ ] **Step 3:** `Ambientes`, `Servicos` (`id="servicos"`), `Projetos`: `<section>` com `<h2>` e cartões (`<h3>` + texto/lista) iterando os arrays.
- [ ] **Step 4:** `Canal`: `<h2>Tech Curioso: uma curiosidade de tecnologia por dia</h2>`; se `videos.length`, grade de cartões `<a href={v.url}>` com `<img src={v.thumb} alt="" loading="lazy" width="480" height="360">` + `<span>{v.titulo}</span>` (Astro escapa o texto); sempre os botões "Inscrever-se no canal" (`CANAL.inscrever`) e "Ver o canal" (`CANAL.url`).
- [ ] **Step 5:** `QuemSomos`: razão social, CNPJ, `EMPRESA.cidade`, `EMPRESA.atendimento`. `Contato` (`id="contato"`): botão WhatsApp + `CONTATO.whatsapp`, link de e-mail; rodapé com links `/gtech-system/privacidade.html` e `/gtech-system/termos.html` e "© 2026 G-TECH System".
- [ ] **Step 6:** `WhatsFlutuante`: `<a class="whats-flutuante" href={CONTATO.whatsappLink} aria-label="Falar no WhatsApp">` com ícone SVG inline (`aria-hidden="true"`), `position:fixed;right:16px;bottom:16px`, só em telas < 768 px; rodapé com `padding-bottom: 88px` no celular para não ficar coberto.
- [ ] **Step 7:** `npm run build && npm test` → sucesso. Commit `feat: seções da landing`.

### Task 5: Repositório e deploy automático

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1:** `deploy.yml`:
```yaml
name: Deploy
on:
  push: { branches: [main] }
  schedule: [{ cron: '0 9 * * *' }]   # todo dia: atualiza os vídeos do canal
  workflow_dispatch:
permissions: { contents: read, pages: write, id-token: write }
concurrency: { group: pages, cancel-in-progress: false }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 24, cache: npm }
      - run: npm ci
      - run: npm test
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: { name: github-pages, url: '${{ steps.d.outputs.page_url }}' }
    steps:
      - id: d
        uses: actions/deploy-pages@v4
```
- [ ] **Step 2:** `gh repo create rennangalvao/rennangalvao.github.io --public --source . --push` e `gh api -X POST repos/rennangalvao/rennangalvao.github.io/pages -f build_type=workflow`.
- [ ] **Step 3:** Acompanhar `gh run watch` até concluir; `curl -s -o /dev/null -w '%{http_code}' https://rennangalvao.github.io/` → 200 e `curl -s ... | grep -c 'G-TECH System'` ≥ 1.

### Task 6: Verificação final

- [ ] **Step 1:** Screenshots do site publicado em 360 px e 1280 px (Playwright): sem rolagem horizontal (`document.documentElement.scrollWidth <= innerWidth`), botão flutuante visível só no celular e sem cobrir o rodapé.
- [ ] **Step 2:** Teclado: Tab a partir do topo — 1º foco é "Pular para o conteúdo", todos os links com contorno visível.
- [ ] **Step 3:** Lighthouse mobile no site publicado (`npx lighthouse https://rennangalvao.github.io/ --form-factor=mobile --only-categories=performance,accessibility,best-practices,seo --chrome-path=<chromium do playwright> --quiet --output=json`) → todas ≥ 90; se alguma falhar, corrigir e repetir.
- [ ] **Step 4:** Checklist do Specter (title_unico, meta_description, open_graph, um_h1_por_pagina, url_canonica, sitemap_robots, html_indexavel) conferido no `dist/index.html`.
- [ ] **Step 5:** Commit final + revisão de todo o projeto por revisor independente (superpowers:requesting-code-review).
