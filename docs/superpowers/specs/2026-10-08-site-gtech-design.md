# Site G-TECH System — especificação (design)

Data: 08/10/2026 · Aprovação do desenho: Rennan (conversa de 08/10/2026)

## Objetivo
Landing page da **G-TECH System** (G-TECH AUTOMACAO E SISTEMAS LTDA, CNPJ 68.816.887/0001-24) em
**https://rennangalvao.github.io/** para **conseguir clientes** e **mostrar o canal Tech Curioso (@gtechcurioso)**.

**Métrica de sucesso:** visitante clica em "Pedir orçamento no WhatsApp". (Medição de cliques fica para a fase 2.)

## Público
Indústrias, concessionárias/operadoras de subestação, escritórios e residências em Palmas/TO e região (presencial);
empresas e profissionais de todo o Brasil para software, automação com IA e sites (remoto).

## Contato (fixo no site)
- WhatsApp principal: **+55 63 98121-2444** — link `https://wa.me/5563981212444?text=<mensagem pronta>`
  (mensagem: "Olá, G-TECH! Vim pelo site e quero um orçamento.").
- E-mail alternativo: **gtech.instrumentacao@gmail.com** (`mailto:` com assunto "Orçamento pelo site").
- No celular: botão flutuante de WhatsApp sempre visível (com rótulo acessível).

## Conteúdo (uma página, nesta ordem)
1. **Topo (hero):** logo, nome "G-TECH System", frase principal "Software e automação do chão de fábrica à sua casa",
   subtítulo curto, botão primário WhatsApp, botão secundário "Ver o que fazemos" (âncora para Serviços).
2. **Onde atuamos:** 4 cartões — Indústria, Subestações, Escritórios, Casas — cada um com 2–3 exemplos concretos.
3. **Serviços:** Instrumentação e automação industrial · Software sob encomenda · Automação com IA (bots WhatsApp/Telegram, n8n) · Sites e landing pages.
4. **Projetos realizados** (sem nomes de clientes): agenda online de barbearia com aviso no WhatsApp; atendimento de delivery por WhatsApp com IA (cardápio e taxa por localização); orquestração de pagamentos via PIX; canal de vídeos produzido automaticamente com IA.
5. **Canal Tech Curioso:** 6 vídeos mais recentes (miniatura + título + link), botão "Inscrever-se" (`?sub_confirmation=1`).
6. **Quem somos:** razão social, CNPJ, "Palmas/TO · atendimento remoto em todo o Brasil" (sem rua/número: o endereço do CNPJ é residencial).
7. **Contato:** WhatsApp + e-mail; rodapé com links para `/gtech-system/privacidade.html` e `/gtech-system/termos.html`.

Copy em português do Brasil, direta, sem jargão de agência (passa pelo filtro stop-slop).

## Visual
Tema escuro técnico, cores derivadas da logo G-TECH (azul + verde-água), tipografia Inter (texto) + JetBrains Mono (detalhes),
coerente com as thumbnails do Tech Curioso. Mobile-first, contraste AA, foco visível, navegação por teclado.
Logo: imagem de perfil da conta Google/canal (obtida pela API do YouTube, `snippet.thumbnails`).

## Técnica
- **Astro** criado no cortex com `new-project.sh astro gtech-site` (pasta `/storage/projects/developer/gtech-site`).
- **Repositório:** `rennangalvao/rennangalvao.github.io` (site de usuário → serve na raiz). Push pelo `gh` do cortex.
- **Deploy:** GitHub Actions (build Astro → GitHub Pages) em todo push **e diariamente** (cron 09:00 UTC) para atualizar os vídeos.
- **Vídeos do canal:** no build, ler o feed público `https://www.youtube.com/feeds/videos.xml?channel_id=UC9NiI-ewQ-U4XrKaqHIH26Q`
  (sem chave). Se o feed falhar ou vier vazio, a seção do canal mostra só o botão "Ver o canal" — o build **não** falha.
- Sem JavaScript de framework no cliente (HTML/CSS estáticos; o botão flutuante é CSS).

## Qualidade (checklist do Specter: seo-basico, astro-site-conteudo)
title único, meta description, Open Graph (imagem 1200x630), um h1, URL canônica, sitemap + robots, HTML indexável;
dados estruturados `LocalBusiness` com nome, telefone, e-mail, área atendida e endereço **só cidade/estado** (Palmas, TO) — o endereço completo do CNPJ é residencial e não vai para o site;
Lighthouse mobile ≥ 90 em Performance, Acessibilidade, Boas práticas e SEO.

## Fora do escopo (fase 2)
Páginas por serviço, blog, contagem de cliques no WhatsApp, domínio próprio (ex.: gtechsystem.com.br), formulário com backend.
