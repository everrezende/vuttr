# VUTTR (Very Useful Tools to Remember) API

Essa API foi construída com a finalidade de permitir ao usuário ter um catálogo de fácil acesso das ferramentas mais úteis do seu dia-a-dia.

## Configurações

Os arquivos de configuração da API estão localizados no diretório src/config.

O arquivo **database.js** é responsável pelas configurações de conexão com o banco de dados, caso você necessite atualizar a URL de conexão com o MongoDB, basta editar a constante "connectionUrl".

O arquivo **auth.json** contém as configurações referentes a autenticação e autorização.

O arquivo **swagger.definitions.js** é responsável pelas configurações e conteúdo da documentação swagger.

### Configuração inicial do banco de dados

Para a execução da API é necessário criar um banco de dados com o nome "tools_db" na sua instância de MongoDB, isso pode ser feito executando o comando `use tools_db` pelo terminal ou seu client preferido de mongoDB.

Em seguida crie as collections necessárias para o uso da api executando os comandos a baixo:

    db.createCollection("usersystems")
    db.createCollection("tools")

E então defina um usuário de sistema inicial executando:

    db.usersystems.insert({ "secretId" : "idSecreto" , "secretKey" : "123" })

O banco de dados já está configurado e pronto para uso.

### Configurando rotas públicas

O arquivo **auth.json** permite definir que determinadas rotas possam ser chamadas por determinados verbos sem a necessidade do token de autenticação, dessa forma, tornando-as públicas.

Para definir uma rota pública basta incluir um novo objeto no array "publicRoutes", definindo no atributo "url" qual é a rota, e no atributo "method" qual é método de invocação que não exigirá autenticação.

### Configuração do Swagger

O arquivo **swagger-definitions.js** contém as configurações da documentação swagger (que pode ser acessada pelo browser através da rota http://localhost:3000/apic-docs).

Para adicionar uma nova operação à documentação swagger, basta editar o arquivo **paths.json** que está localizado dentro do diretório src/config/swagger.

Para adicionar um novo modelo à documentação swagger, basta editar o arquivo **definitions.json** que está localizado dentro do diretório src/config/swagger.

Ambos os arquivos seguem o formato de JSON comum do Swagger 2.0.

## Iniciando a aplicação

A API pode ser iniciada executando o comando a baixo na pasta raiz do projeto:

    node startup.js

A aplicação está configurada para ser Multi Threads, então será possível ver no console diversas mensagens de inicialização da API com o respectivo ID de Processo (PID) de cada uma delas.

Antes de colocar sua API no ar pela primeira vez, não esqueça de baixar as dependências necessárias para o projeto executando `npm install` na pasta raiz do projeto.

Para verificar se a API está sendo executada corretamente, basta acessar o endereço http://localhost:3000 pelo navegador, um texto com a palavra "OK" deverá ser exibido na página indicando que a API está pronta para ser executada.

Se nenhuma mensagem de erro for exibida no log durante o processo de inicialização, você pode chamar qualquer uma das operações disponíveis na API conforme a documentação Swagger (http://localhost:3000/api-docs)

## Testando a API

Antes de executar o startup, é possível verificar se tudo está funcionando corretamente executando os teste automatizados da API.

Para isso, é necessário instalar o Mocha executando o comando a baixo com permissões de administrador:

    npm install -g mocha

Em seguida basta acessar a pasta raiz do projeto e executar o comando `mocha`.

Os resultados dos testes poderão ser visualizados no console.
