# Projeto To-Do List Fullstack (Guia Completo)

Bem-vindo ao projeto To-Do List! Este é um sistema completo de gerenciamento de tarefas (um "To-Do List") onde cada usuário pode criar sua conta, fazer login e gerenciar suas próprias atividades com total segurança e privacidade.

Este documento foi escrito para te ajudar a rodar o projeto no seu próprio computador. Siga o passo a passo!

---

## 1. Verificando os Pré-requisitos

Antes de qualquer coisa, precisamos garantir que o seu computador tem as ferramentas necessárias. Abra o seu **Terminal** (no Windows pode ser o PowerShell ou Prompt de Comando) e digite os comandos abaixo para testar:

### A. Verificando o Node.js e NPM
O Node.js é o motor que vai rodar o nosso código. Digite no terminal:
```bash
node -v
```
Se aparecer algo como `v18.17.0` (ou qualquer número superior a 18), está tudo certo! Em seguida, teste o NPM (que é o instalador de pacotes do Node):
```bash
npm -v
```
Se aparecer um número (exemplo: `9.6.7`), sucesso! 
*Se der erro de "comando não reconhecido", baixe e instale o Node.js no site oficial: https://nodejs.org*

### B. Verificando o Git
O Git serve para baixar o código do projeto diretamente do GitHub. Digite:
```bash
git --version
```
Se aparecer algo como `git version 2.x.x`, você já o tem instalado. 
*Se não tiver, baixe em: https://git-scm.com/downloads*

### C. PostgreSQL
Este é o nosso banco de dados. Você não precisa testar por comando de terminal, basta procurar no menu Iniciar do seu computador pelo programa chamado **pgAdmin 4**. Se ele estiver lá, você tem o banco de dados instalado. 
*Se não tiver, baixe o instalador do Windows em: https://www.postgresql.org/download/*

---

## 2. Baixando o Projeto

No seu terminal, navegue até a pasta onde você quer salvar o projeto (por exemplo, usando `cd Desktop` para salvar na Área de Trabalho) e digite o comando de clone:

```bash
git clone https://github.com/AndreVieira0/To-do-list.git
```

Depois que o download terminar, entre na pasta que acabou de ser criada:

```bash
cd To_do_List
```

---

## 3. Criando o Banco de Dados (PostgreSQL)

O nosso sistema precisa de um espaço reservado no seu computador para guardar os usuários e as tarefas.

1. Abra o programa **pgAdmin 4** no seu computador.
2. Ele vai pedir uma senha mestre (é a senha que você mesmo escolheu quando instalou o PostgreSQL).
3. Na barra lateral esquerda, expanda as setinhas: `Servers` > `PostgreSQL`.
4. Clique com o botão direito sobre o ícone do cilindro chamado **Databases** e escolha **Create** > **Database...**
5. Vai abrir uma janela. No primeiro campo chamado **Database**, digite exatamente o nome: `todo_db`
6. Clique no botão **Save**. 

Pronto! Você não precisa criar tabelas nem entender de SQL agora, o nosso código do Backend foi programado para criar as tabelas sozinho.

---

## 4. Configurando o Backend (A API do Sistema)

O Backend é onde a mágica dos dados acontece, verificando senhas e salvando informações com segurança.

No seu terminal (certifique-se que está dentro da pasta `To_do_List`), entre na subpasta do backend:
```bash
cd backend
```

Instale as dependências (isso vai ler o arquivo package.json e baixar tudo o que o projeto precisa):
```bash
npm install
```

Agora, precisamos configurar a senha do seu banco de dados no projeto. O GitHub não guarda senhas por segurança, então nós enviamos um modelo chamado `.env.example`.
1. Você precisa criar uma cópia desse arquivo e chamar a cópia apenas de `.env`. Pelo terminal do Windows, você faz isso usando:
```bash
copy .env.example .env
```
*(Alternativa: Você pode ir pelo Explorador de Arquivos do Windows, entrar na pasta backend, copiar o arquivo `.env.example`, colar lá mesmo e renomear a cópia apagando a palavra "example").*

2. Abra este novo arquivo `.env` no seu editor de código (como o VS Code) ou até no Bloco de Notas.
3. Altere o valor de `DB_PASSWORD` preenchendo com a mesma senha que você usou para abrir o pgAdmin. O arquivo final deve ficar assim:
```text
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=coloque_sua_senha_do_banco_aqui
DB_DATABASE=todo_db
JWT_SECRET=frase_secreta_qualquer_para_proteger_os_tokens
```

Salve o arquivo. Agora é a hora de ligar o servidor:
```bash
npm run start:dev
```
Aguarde. O terminal vai carregar várias linhas. Se as últimas linhas mostrarem mensagens verdinhas dizendo "Nest application successfully started", significa que seu servidor está no ar e funcionando na porta 3000!

---

## 5. Configurando o Frontend (A Tela do Sistema)

Para a tela funcionar, o backend **precisa continuar rodando**. Portanto, **NÃO FECHE** a janela do terminal onde o backend está ligado.
Em vez disso, abra uma **NOVA ABA ou NOVA JANELA** de terminal.

Neste novo terminal, garanta que você entrou na pasta do projeto e então acesse a pasta do frontend:
```bash
cd caminho/ate/o/To_do_List
cd frontend
```

Instale as dependências visuais (botões, React, Tailwind, etc):
```bash
npm install
```

Por fim, inicie o site:
```bash
npm run dev
```

O terminal vai te devolver uma mensagem com um link local, normalmente `http://localhost:5173`.

---

## 6. Tudo Pronto para o Teste!

Agora é só abrir o seu navegador de internet favorito (Chrome, Edge, Firefox) e acessar: **http://localhost:5173**

Um roteiro de teste para ver tudo funcionando:
1. Na tela principal de Login, clique em "Não tem uma conta? Registre-se".
2. Crie um usuário de teste (as senhas são guardadas com criptografia).
3. Após criar a conta, você será jogado para o Dashboard.
4. Experimente criar 3 tarefas.
5. Marque uma como concluída (clicando no círculo ao lado dela).
6. Digite palavras na Barra de Pesquisa e veja as tarefas filtrando instantaneamente.
7. Alterne entre as abas "Todas", "Pendentes" e "Concluídas".
8. Dê dois cliques no nome de uma tarefa para habilitar a Edição, mude o nome e aperte Enter.

### Arquitetura Final
- **Lado do Servidor (Backend):** NestJS, PostgreSQL (TypeORM) e Tokens JWT para Sessões de Usuário.
- **Lado do Cliente (Frontend):** React.js (rodando via Vite), TypeScript, TailwindCSS v3 para estilos em Glassmorphism.
