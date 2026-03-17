# Deploy no Vercel (este projeto é Next.js)

O repositório é **100% Next.js**. Se o Vercel mostrar preset "Vite", ignore e configure assim:

## Ao importar o projeto

1. **Add New** → **Project** → importe `https://github.com/ticoloco1/royal-fintech-hub`
2. Na tela de configuração, **não confie no preset**. Ajuste manualmente:
   - **Framework Preset:** se aparecer "Vite", troque para **"Other"** (Outro)
   - **Build Command:** `next build`
   - **Output Directory:** `.next` (ou deixe em branco)
   - **Install Command:** `npm install` (ou em branco)
3. **Deploy**

O `vercel.json` na raiz já define `framework: nextjs` e `buildCommand: next build`. Se mesmo assim o build rodar como Vite, use os valores acima nos **Overrides** do projeto.

## Alternativa: novo repositório (sem cache)

Se o Vercel continuar detectando Vite no mesmo repo:

1. Crie um **novo repositório** no GitHub (ex.: `royal-fintech-hub-next`)
2. Faça push deste código para o novo repo (ou use o mesmo repo e apenas reconecte no Vercel após apagar o projeto antigo)
3. No Vercel: **Add New** → **Project** → importe o **novo** repositório
4. Assim o Vercel não usa cache do projeto antigo e deve detectar Next.js
