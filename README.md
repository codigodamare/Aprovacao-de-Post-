# Portal de Aprovação — Agência de Marketing

Site para a agência publicar os posts do mês (imagem/vídeo + legenda + data) e o
cliente aprovar ou comentar diretamente na tela, com a agência vendo a resposta
automaticamente.

## Stack

- Next.js (App Router) + TypeScript + Tailwind
- Prisma + Postgres (recomendado: [Neon](https://neon.tech), gratuito)
- Upload de mídia via [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
- Autenticação própria (bcrypt + cookie de sessão assinado)

## Rodando localmente

1. Crie um banco gratuito no [Neon](https://neon.tech) e copie a "connection string".
2. Crie um Blob store no [dashboard da Vercel](https://vercel.com/dashboard) → Storage → Blob, e copie o token `BLOB_READ_WRITE_TOKEN`.
3. Cole os dois valores no arquivo `.env` (`DATABASE_URL` e `BLOB_READ_WRITE_TOKEN`).
4. Instale as dependências e aplique o schema no banco:

   ```bash
   npm install
   npx prisma migrate dev --name init
   npm run seed
   ```

5. Rode o servidor:

   ```bash
   npm run dev
   ```

6. Acesse [http://localhost:3000](http://localhost:3000).

   - Agência: `agencia@suaagencia.com` / `agencia123`
   - Cliente (Tik Dèia): `tikdeia@cliente.com` / `tikdeia123`

   (Troque essas senhas antes de usar com clientes reais — edite `prisma/seed.ts`
   ou crie usuários diretamente no banco.)

## Deploy (Vercel)

1. Suba este repositório para o GitHub.
2. Importe o repositório em [vercel.com/new](https://vercel.com/new).
3. Na Vercel, adicione um Postgres (Neon) e um Blob store ao projeto — isso
   preenche `DATABASE_URL` e `BLOB_READ_WRITE_TOKEN` automaticamente.
4. Adicione a variável `JWT_SECRET` (qualquer string longa e aleatória).
5. Depois do primeiro deploy, rode as migrações e o seed contra o banco de
   produção (uma vez, localmente, apontando o `.env` para a `DATABASE_URL` de
   produção):

   ```bash
   npx prisma migrate deploy
   npm run seed
   ```

6. Pronto — o site estará no ar em `https://seu-projeto.vercel.app` (dá pra
   trocar por um domínio próprio depois, nas configurações do projeto na Vercel).
