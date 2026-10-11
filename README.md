# Site G-TECH SYSTEMS

Site institucional da G-TECH SYSTEMS (software e automação, Palmas/TO): uma página em Astro, sem
JavaScript no cliente, publicada no GitHub Pages em https://rennangalvao.github.io/.

## Montar e testar

```sh
npm install
npm run dev     # servidor local
npm run build   # gera o dist/
npm test        # roda depois do build: o teste de privacidade varre o dist/
```

Os textos, o contato e a lista de serviços ficam em `src/data/site.mjs`. O número de telefone
existe uma vez só (`FONE`); o link do WhatsApp, o número exibido e o do JSON-LD saem dele.

## Vídeos do canal e `.videos-cache.json`

No build, `src/lib/youtube.mjs` lê o feed RSS público do canal e mostra os 6 vídeos mais recentes.
Cada leitura boa é gravada em `.videos-cache.json` (fora do git). Se o feed falhar ou vier vazio (o
YouTube às vezes devolve 404 por horas), o build usa essa última lista e avisa no log; sem cache, o
site sai sem a seção de vídeos, mas o build não quebra.

## Dados privados

`.privado` (fora do git) lista termos que nunca podem ir a público, um por linha. O `npm test`
falha se algum deles aparecer nos dados ou no `dist/`, e isso barra a publicação.

## Publicação

`deploy.sh` monta, testa e envia o `dist/` para a branch `gh-pages`. No cortex, o timer systemd
`site-gtech` roda o script todo dia às 11:15 do relógio do cortex (America/Chicago, 13:15 em
Brasília), depois do Short das 12h, para puxar os vídeos novos. O log fica em `deploy.log`. Para
publicar na hora: `./deploy.sh`.
