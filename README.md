<h1 align="center">
  <br>
   Leitor de Consumo AI
  <br>
</h1>
<h4 align="center">Um serviço que gerencia medição e leitura individualizada de consumo de água e gás, feito com <b>Typescript</b> e <b>Node.js</b>, usando o <b>Google Gemini AI</b></h4>

<div align='center'>

![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Fastify](https://img.shields.io/badge/fastify-%23000000.svg?style=for-the-badge&logo=fastify&logoColor=white)
![Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Zod](https://img.shields.io/badge/zod-%233068b7.svg?style=for-the-badge&logo=zod&logoColor=white)
![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)

</div>

<p align="center">
  <a href="#recursos-principais">Recursos principais</a> •
  <a href="#como-usar">Como usar</a> •
  <a href="#melhorias">Melhorias</a> •
  <a href="#creditos">Créditos</a> •
  <a href="#todo">TODO</a>
</p>

## Recursos principais

- Faça o upload de uma imagem de um medidor de gás ou água
- A IA irá ler a imagem e obter a medição, retornando o valor
- A aplicação irá pedir a confirmação o valor dessa medição
- Salva no banco de dados os dados da medição, com o seu tipo (água ou gás)
- Lista todas as medições pelo código do consumidor

## Como usar

Para clonar essa aplicação, você precisará ter instalado na sua máquina o [Node.js](https://nodejs.org/en/download/) (que vem com o [npm](http://npmjs.com)) e o [Docker](https://www.docker.com/get-started/) com [Docker Compose](https://docs.docker.com/compose/install/).

- Da sua linha de comando:

  ```bash
  # Clone este repositório
  $ git clone https://github.com/evans-costa/teste-dev-shopper.git

  # Vá para a pasta do repositório
  $ cd teste-dev-shopper
  ```

- Renomeie o arquivo `.env.example` para `.env` e preencha com a API KEY do Gemini

  ```env
  NODE_ENV=development

  POSTGRES_PORT=5432
  POSTGRES_USER=local_user
  POSTGRES_DB=local_db
  POSTGRES_PASSWORD=local_password

  DATABASE_URL=postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@localhost:$POSTGRES_PORT/$POSTGRES_DB

  GEMINI_API_KEY=<YOUR-GEMINI-API-KEY>
  ```

  > **📌 Nota:** </br>
  > Para gerar uma chave de API do Google Gemini, por favor, siga as instruções contidas [nesse link](https://ai.google.dev/gemini-api/docs/api-key?hl=pt-br).

### Ambiente local

Para rodar essa aplicação localmente, siga essas instruções:

- Instale as dependências:
  ```bash
  # Instale as dependências
  $ npm install
  ```
- Rode o seguinte comando:

  ```bash
  # Suba os serviços e o servidor
  $ npm run dev:local
  ```

  Isto irá subir o contêiner com o banco de dados, rodar as migrações, fazer o seed de um usuário na tabela `customers` e subir o servidor no endereço `http://localhost:3000`

### Ambiente conteinerizado

- Alternativamente, você pode subir todos os serviços, tanto a aplicação Node e os serviços do banco de dados, em uma rede de contêineres Docker
- Rode o seguinte comando:

  ```bash
  # Suba os serviços e o servidor
  $ npm run services:up
  ```

  Isso irá subir o contêiner do PostgreSQL, o contêiner do Node e estabelecer a conexão entre eles, assim como instalar as dependências, rodar as migrações e fazer o seed de um usuário na tabela `customers`, além de rodar o servidor no endereço `http://localhost:3000`

### Testando a API

- Você agora pode testar a API da seguinte maneira:
  - Use o `customer_code`: `33f02178-e1bd-466d-a9a6-fa3f56cacda1`, criado no momento do seed do banco de dados, para testar os endpoints.
  - Acesse `http://localhost:3000/documentation`, onde todos os endpoints da aplicação estão expostos por meio da interface do `SwaggerUI`
    **OU**
  - No seu cliente API REST de preferência como [Insomnia](https://insomnia.rest/download), [Postman](https://www.postman.com/), [Hoppscotch](https://hoppscotch.io/)...

## Melhorias

- Uso de `conventional commits` aliado ao `Husky` e o pacote `commitlint` para automatizar os commits usando o comando `npm run commit`, assim, no momento do commit, as definições já são expostas na CLI;
- Documentação com o uso do Swagger;
- Separação de responsabilidades usando repositórios, controllers e services;
- Tratamento de erros;
- Scripts de linting garantindo qualidade e estilização do código;
- Migrações e seed do banco de dados.

## Créditos

Esse como parte do desafio para a vaga de Desenvolvedor Full Stack da <a href="https://landing.shopper.com.br/" target="_blank">Shopper</a>

## TODO

- [ ] Testes automatizados

> GitHub [@evans-costa](https://github.com/evans-costa) &nbsp;&middot;&nbsp;
> LinkedIn [@evandro-souzac](https://www.linkedin.com/in/evandro-souzac/) &nbsp;&middot;&nbsp;
> Site [@evandrocosta.dev.br](https://evandrocosta.dev.br)
