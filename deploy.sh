#!/usr/bin/env bash
# Publica o site no GitHub Pages (branch gh-pages): testa, monta (puxa os vídeos novos do canal) e envia.
# Roda todo dia pelo timer site-gtech (cortex) e pode ser chamado à mão depois de qualquer mudança.
set -euo pipefail
cd "$(dirname "$0")"
# o log ninguém lê: falha no build, no teste ou no push vai pro Telegram (robô do canal-ia)
trap 'python3 -c "import sys; sys.path.insert(0, \"/storage/projects/developer/canal-ia/monitor\"); import relatorio; relatorio.enviar(sys.argv[1])" \
  "⚠️ Site: o deploy falhou na linha $LINENO: $BASH_COMMAND
Detalhes em gtech-site/deploy.log" || echo "aviso no Telegram não enviado"' ERR
npm run build
npm test   # depois do build: o teste de privacidade varre o dist/ e barra a publicação
cd dist
rm -rf .git
git init -q -b gh-pages
git add -A
git -c user.name="cortex" -c user.email="gtech.instrumentacao@gmail.com" commit -q -m "deploy $(date -u +%FT%TZ)"
git push -q -f https://github.com/rennangalvao/rennangalvao.github.io.git gh-pages
rm -rf .git
echo "publicado: https://rennangalvao.github.io/"
