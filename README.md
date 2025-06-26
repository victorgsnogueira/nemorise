# Nemori$e - Seu Gerenciador Financeiro Pessoal

Bem-vindo ao Nemori$e, uma aplicação web moderna e intuitiva projetada para ajudar você a tomar o controle da sua vida financeira. Com uma interface limpa e funcionalidades poderosas, o Nemori$e simplifica o rastreamento de despesas, receitas, cartões e categorias.

## ✨ Funcionalidades Principais

- **Dashboard Interativo:** Visualize um resumo completo da sua saúde financeira, incluindo saldo total, total de receitas e despesas, e as transações mais recentes.
- **Autenticação Segura:** Sistema de login e registro de usuários utilizando NextAuth.js para garantir a segurança e privacidade dos seus dados.
- **Gerenciamento de Transações (CRUD):**
  - **Despesas:** Adicione, edite, visualize e remova suas despesas.
  - **Receitas:** Controle todas as suas fontes de renda com operações CRUD completas.
- **Organização Financeira:**
  - **Cartões:** Cadastre e gerencie múltiplos cartões de crédito ou débito.
  - **Categorias:** Crie categorias personalizadas para despesas e receitas, permitindo uma organização detalhada.
- **Interface Rica e Responsiva:**
  - Tabelas interativas com filtros e busca para encontrar transações facilmente.
  - Modais para adição e edição de dados, proporcionando uma experiência de usuário fluida.
  - Design moderno construído com **shadcn/ui** e **Tailwind CSS**.
- **Estado Centralizado:** Gerenciamento de estado eficiente e reativo utilizando a Context API do React com `useReducer`.

## 🚀 Tecnologias Utilizadas

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Banco de Dados:** [Prisma](https://www.prisma.io/) com [SQLite](https://www.sqlite.org/index.html)
- **Autenticação:** [NextAuth.js](https://next-auth.js.org/)
- **UI & Estilização:**
  - [React](https://reactjs.org/)
  - [Tailwind CSS](https://tailwindcss.com/)
  - [shadcn/ui](https://ui.shadcn.com/) - Componentes de UI
  - [Lucide React](https://lucide.dev/) - Ícones
- **Requisições API:** [Ky](https://github.com/sindresorhus/ky)
- **Gerenciamento de Estado:** React Context API (`useReducer`)
- **Notificações:** [Sonner](https://sonner.emilkowal.ski/)

## ⚙️ Como Começar

Siga os passos abaixo para configurar e rodar o projeto em seu ambiente de desenvolvimento local.

### Pré-requisitos

- [Node.js](https://nodejs.org/en/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

### 1. Clone o Repositório

```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd nemorise
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Configure as Variáveis de Ambiente

Crie um arquivo chamado `.env.local` na raiz do projeto e adicione as seguintes variáveis. Para o `NEXTAUTH_SECRET`, você pode gerar uma chave segura (por exemplo, usando `openssl rand -base64 32`).

```.env.local
# URL da sua aplicação
NEXTAUTH_URL="http://localhost:3000"

# Chave secreta para o NextAuth.js
NEXTAUTH_SECRET="SUA_CHAVE_SECRETA_AQUI"

# URL do banco de dados (o padrão aponta para o arquivo SQLite)
DATABASE_URL="file:./dev.db"
```

### 4. Aplique as Migrações do Banco de Dados

Este comando irá criar o banco de dados SQLite (`dev.db`) e aplicar o schema definido no Prisma.

```bash
npx prisma migrate dev
```

### 5. Rode o Servidor de Desenvolvimento

Agora você está pronto para iniciar a aplicação!

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) em seu navegador para ver o projeto em ação.

## 📁 Estrutura do Projeto

O projeto segue a estrutura do App Router do Next.js:

```
nemorise/
├── prisma/                 # Schema e migrações do banco de dados
│   └── schema.prisma
├── public/                 # Arquivos estáticos
├── src/
│   ├── app/
│   │   ├── (app)/          # Rotas protegidas da aplicação (requer login)
│   │   │   ├── dashboard/
│   │   │   ├── despesas/
│   │   │   ├── receitas/
│   │   │   ├── cartoes/
│   │   │   ├── categorias/
│   │   │   └── layout.tsx  # Layout principal da área logada
│   │   ├── api/            # Endpoints da API (autenticação, CRUDs)
│   │   └── login/          # Página de login
│   ├── components/         # Componentes de UI reutilizáveis (shadcn)
│   ├── contexts/           # Contexto React para gerenciamento de estado
│   └── lib/                # Funções utilitárias
└── README.md
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
