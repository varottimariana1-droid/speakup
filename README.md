# Speak Up — inglês básico para crianças

Site estático (HTML + CSS + JS puro). Sem build, sem backend, sem dependências.

## Como abrir
- Direto: abra `index.html` no navegador, ou
- Local com servidor: `npx serve .`

## Como publicar (GitHub + Vercel)
1. Suba esta pasta para um repositório no GitHub.
2. Na Vercel: **Add New → Project**, importe o repositório.
3. Framework Preset: **Other**. Sem build command. Deploy.

## Estrutura
- `data.js` — todo o conteúdo (temas, palavras, pronúncia, frases). Para adicionar um tema, copie um bloco e edite.
- `app.js` — telas, jogos, áudio e progresso.
- `styles.css` — visual.

## Notas
- Áudio: voz do próprio navegador (Web Speech API). A qualidade varia por aparelho.
- Progresso (estrelas, dias seguidos, palavras difíceis) fica salvo no aparelho (localStorage).
