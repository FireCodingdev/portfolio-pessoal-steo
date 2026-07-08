# Portfólio + CRM — Stefanny Ferreira

Este projeto é a evolução do site de portfólio estático (`index.html`) para uma
aplicação **Next.js** com:

- 🌐 O mesmo site público, visualmente idêntico ao original (mesmo design, cores e textos).
- 🔐 Uma **tela de login** protegida.
- 📊 Um **dashboard** com métricas reais: mensagens recebidas (leads), downloads
  do currículo e visualizações do site, com gráficos dos últimos 14 dias.
- 🧭 Um **menu lateral** com uma aba para editar manualmente cada seção da
  página principal (Início, Sobre, Habilidades, Projetos, Experiência,
  Educação e Contato) — sem precisar mexer em código.
- 📥 Uma aba de **Leads**, com todas as mensagens enviadas pelo formulário de
  contato do site, status (Novo / Em contato / Concluído) e opção de excluir.
- ⚙️ Uma aba de **Configurações** para trocar a senha de acesso.

Tudo isso continua rodando 100% na Vercel, exatamente como o site atual.

---

## 1. O que muda em relação ao site atual

O projeto deixou de ser um único `index.html` estático e passou a ser uma
aplicação Next.js (obrigatório, pois agora existe login, banco de dados e
API). Por isso, **substitua todo o conteúdo do repositório do GitHub pelos
arquivos deste ZIP** (mantendo o mesmo repositório e o mesmo projeto na
Vercel). A Vercel detecta Next.js automaticamente, não é preciso mudar
nenhuma configuração de build.

Os arquivos originais (`imagens/foto-da-ste.jpeg`, `imagens/logo-firecoding.png`
e `curriculo.pdf`) já foram movidos para dentro de `public/imagens/` e
`public/curriculo.pdf` — nada foi perdido.

---

## 2. Passo a passo do deploy

### 2.1. Substituir os arquivos no GitHub

1. Baixe e extraia este ZIP.
2. No seu repositório local (ou direto pelo GitHub), apague todos os arquivos
   antigos e copie todos os arquivos deste projeto no lugar (mantenha a
   pasta `.git`, se estiver trabalhando localmente).
3. Faça commit e push para o GitHub. A Vercel vai iniciar um novo deploy
   automaticamente — **mas ele ainda vai falhar** até você completar os
   passos 2.2 e 2.3 abaixo (o app precisa de um banco de dados e de senhas).

### 2.2. Criar o banco de dados (Postgres) na Vercel

1. Abra o projeto na Vercel → aba **Storage**.
2. Clique em **Create Database** → escolha **Postgres** (ou "Neon Postgres",
   dependendo do que aparecer — é a mesma coisa, a Vercel migrou o Postgres
   para rodar sobre a infraestrutura da Neon).
3. Crie o banco e, quando perguntado, **conecte-o a este projeto**. A Vercel
   vai preencher sozinha as variáveis `POSTGRES_URL`, `POSTGRES_PRISMA_URL`
   e `POSTGRES_URL_NON_POOLING` nas configurações do projeto.
4. Não é preciso criar tabelas manualmente — o próprio app cria as tabelas
   necessárias automaticamente na primeira vez que é usado.

### 2.3. Configurar o login do painel

1. Na Vercel, vá em **Settings → Environment Variables** e adicione:

   | Nome              | Valor                                                   |
   |-------------------|----------------------------------------------------------|
   | `ADMIN_EMAIL`     | O email que a cliente vai usar para entrar no painel     |
   | `ADMIN_PASSWORD`  | Uma senha provisória (ela poderá trocar depois pelo próprio painel) |
   | `JWT_SECRET`      | Uma string aleatória e longa (ex: gerada em https://generate-secret.vercel.app/32) |

2. Clique em **Redeploy** para aplicar as novas variáveis (ou apenas espere o
   deploy do passo 2.1 terminar, se ele foi feito depois de configurar as
   variáveis).
3. Acesse `https://SEU-SITE.vercel.app/login` e entre com o `ADMIN_EMAIL` e
   `ADMIN_PASSWORD` definidos acima. No primeiro login, o sistema cria a
   conta de administrador automaticamente dentro do banco de dados.
4. Depois disso, recomendo que a cliente troque a senha em
   **Configurações**, dentro do próprio painel — a senha da variável de
   ambiente só é usada nesse primeiro acesso.

Pronto — o site público continua em `/`, e o painel fica em `/dashboard`
(protegido por login).

---

## 3. Como funciona o dia a dia

- **Site público (`/`)**: busca o conteúdo (textos, projetos, links etc.)
  direto do banco de dados a cada acesso. Se algum texto ainda não foi
  editado, ele usa o conteúdo original como padrão — ou seja, nada quebra
  antes de a cliente mexer em nada.
- **Formulário de contato**: em vez de só abrir o email (`mailto:`), agora
  ele salva a mensagem no banco como um "lead", que aparece na aba
  **Mensagens (Leads)** do painel.
- **Download do currículo**: cada clique no botão "Baixar Currículo" é
  contabilizado e aparece na Visão Geral do painel.
- **Visualizações**: cada carregamento da página inicial soma 1 na métrica
  de visualizações do site.
- **Edição de conteúdo**: cada aba do menu lateral (Início, Sobre,
  Habilidades, Projetos, Experiência, Educação, Contato) carrega os dados
  atuais, permite editar e tem um botão **"Salvar alterações"** fixo no
  rodapé da tela. As mudanças aparecem no site público imediatamente.

---

## 4. Rodando localmente (opcional, para desenvolvimento)

```bash
npm install
cp .env.example .env.local   # depois preencha as variáveis
npm run dev
```

Para testar localmente com banco de dados real, use a mesma
`POSTGRES_URL` do banco criado na Vercel (você encontra em
Storage → seu banco → `.env.local` tab, com o botão para copiar as
variáveis).

---

## 5. Notas técnicas

- Stack: **Next.js 14 (App Router)** + **TypeScript** + **Tailwind CSS**
  (usado só no painel — o site público mantém o CSS original) + **Postgres**
  (via `@vercel/postgres`) + **JWT** em cookie `httpOnly` para a sessão de
  login + **bcrypt** para hash de senha.
- O pacote `@vercel/postgres` está marcado como "descontinuado" pela Vercel
  em favor do uso direto do SDK da Neon — ele continua funcionando
  normalmente, mas se quiser modernizar no futuro, dá para trocar por
  `@neondatabase/serverless` sem mudar a estrutura do banco.
- Anti-spam simples: o formulário de contato tem um campo invisível
  (honeypot) — se ele vier preenchido, a mensagem é descartada
  silenciosamente (indício de bot).
- Segurança: todas as rotas de escrita (salvar conteúdo, listar/editar leads,
  ver métricas, trocar senha) exigem login, verificado no `middleware.ts`.
  O site público e o envio do formulário de contato continuam abertos, como
  antes.

---

## 6. Suporte

Qualquer dúvida durante a configuração das variáveis de ambiente ou da
conexão do banco de dados na Vercel, a documentação oficial ajuda bastante:
https://vercel.com/docs/storage e https://vercel.com/docs/environment-variables
