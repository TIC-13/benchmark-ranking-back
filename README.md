
# Benchmarking Ranking

Este projeto é uma API de ranking de benchmarking desenvolvida com Node.js, Express, TypeScript, e Prisma.

## Pré-requisitos

Certifique-se de ter o [Node.js](https://nodejs.org/) instalado em sua máquina.

## Instalação

1. Clone este repositório;

2. Navegue até o diretório do projeto;

3. Instale as dependências:

   ```bash
   yarn
   ```

## Configuração do Prisma

1. Certifique-se de ter uma base de dados configurada e atualize o arquivo `.env` com a URL do seu banco de dados. Exemplo:

   ```
   DATABASE_URL="mysql://user:password@localhost:3306/database-name"
   ```

2. Execute a migração do Prisma para configurar o banco de dados:

   ```bash
   npx prisma db push
   ```

## Executando a aplicação

1. Para iniciar o servidor, execute:

   ```bash
   npm run start
   ```

2. O servidor estará rodando em [http://localhost:3000](http://localhost:3000).
