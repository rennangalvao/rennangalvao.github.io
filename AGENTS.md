## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

<!-- BEGIN:specter -->

# Regras do projeto (Specter)

Vale para qualquer agente (Claude Code, Cline, Codex, OpenCode…). Se falta *decidir* algo
de arquitetura, stack, segurança ou a causa de um bug desconhecido, pare e pergunte.

## Consulte o conhecimento antes de codar

```bash
node /storage/projects/developer/Specter/knowledge/retrieve.mjs <tags>
```

Escolha 2 a 5 tags que descrevam a tarefa (ex.: `api auth`, `frontend responsivo`,
`webhook idempotencia`, `seo astro`). As fichas saem no stdout; fontes e **checklist**, no
stderr. Regras das fichas têm precedência sobre o seu palpite.

## A checklist é o critério de pronto

Antes de dizer que terminou, percorra cada item da checklist e diga como foi atendido.
Item não atendido = não terminou.

## Código mínimo

Pare no primeiro degrau que resolve: precisa existir? → já existe no código? → biblioteca
padrão? → recurso nativo do framework? → dependência já instalada? → poucas linhas? → o
mínimo que funciona.

## Nunca cortar

- Validação de entrada, tratamento de erro e segurança.
- Responsivo e acessível por padrão (mobile-first).
- Segredos só em `.env`, nunca no código nem em arquivo versionado.
- Código novo segue o estilo, os nomes e o idioma do código ao redor.
- Atalho cortado de propósito? Diga o que ficou de fora.

Regra ou padrão reutilizável que surgiu e ainda não é ficha: diga qual, para virar ficha em
`Specter/knowledge/`.

<!-- END:specter -->
