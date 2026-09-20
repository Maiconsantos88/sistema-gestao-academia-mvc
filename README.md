# 🏋️ Fitness Academia - Sistema de Gestão MVC

Sistema web para gerenciamento de academia, desenvolvido como projeto acadêmico do curso de Análise e Desenvolvimento de Sistemas.

O projeto aplica conceitos de arquitetura MVC, integração com API REST, banco de dados MySQL e autenticação de usuários.

## 🌐 Demonstração Online

Acesse o sistema:

https://sistema-gestao-academia-mvc.netlify.app/

> Projeto desenvolvido para fins acadêmicos e demonstração de portfólio.

## 🚀 Tecnologias utilizadas

### Frontend
- HTML5
- CSS3
- JavaScript
- Layout responsivo
- Consumo de API REST

### Backend
- Node.js
- Express
- API REST
- bcrypt para criptografia de senhas
- Speakeasy para autenticação em dois fatores (2FA)
- dotenv para variáveis de ambiente

### Banco de dados
- MySQL
- Relacionamentos entre alunos, planos, pagamentos, treinos e usuários

### Hospedagem
- Netlify - Frontend
- Render - Backend/API
- Aiven - Banco de dados MySQL
- GitHub - Versionamento do código

## 📋 Funcionalidades

- Login de usuários
- Dashboard administrativo
- Cadastro, edição e exclusão de alunos
- Cadastro, edição e exclusão de planos
- Controle de pagamentos
- Cadastro e gerenciamento de treinos
- Associação de alunos aos planos
- Associação de treinos aos alunos
- Perfil do usuário
- Alteração de senha
- Autenticação em dois fatores (2FA)
- Busca de registros
- Validação de e-mail
- Máscara de telefone
- Mensagens de confirmação e feedback
- Interface responsiva para diferentes tamanhos de tela

## 🏗️ Arquitetura MVC

O projeto foi estruturado utilizando conceitos do padrão MVC (Model-View-Controller), buscando separar responsabilidades e facilitar a manutenção e evolução da aplicação.

### Model
Responsável pela representação e manipulação dos dados utilizados pela aplicação.

### View
Responsável pela interface apresentada ao usuário, utilizando HTML, CSS e JavaScript.

### Controller
Responsável pela comunicação entre interface, regras da aplicação, API e banco de dados.

## 🗄️ Banco de Dados

O sistema utiliza MySQL para persistência dos dados.

Principais entidades:

- Usuários
- Alunos
- Planos
- Pagamentos
- Treinos

O projeto contém scripts SQL para criação e configuração das tabelas na pasta:

`backend/Banco de Dados/`

## 🔐 Segurança

O sistema possui recursos de segurança como:

- Senhas armazenadas utilizando hash com bcrypt
- Variáveis sensíveis armazenadas em arquivo `.env`
- Arquivo `.env` ignorado pelo Git
- Autenticação em dois fatores utilizando TOTP
- Validação de dados no sistema

> Credenciais e informações sensíveis do banco de dados não são armazenadas publicamente no repositório.

## 📁 Estrutura do Projeto

```text
fitness-academia-mvc/
│
├── backend/
│   ├── Banco de Dados/
│   ├── package.json
│   └── server.js
│
├── css/
│   └── style.css
│
├── js/
│   ├── model/
│   ├── utils/
│   ├── alunos.js
│   ├── app.js
│   ├── dashboard.js
│   ├── pagamentos.js
│   ├── perfil.js
│   ├── planos.js
│   └── treinos.js
│
├── alunos.html
├── dashboard.html
├── index.html
├── pagamentos.html
├── perfil.html
├── planos.html
├── treinos.html
└── README.md

## ⚙️ Execução local

Para executar o backend localmente:

```bash
cd backend
npm install
node server.js
```

É necessário configurar previamente o arquivo `.env` com as variáveis de ambiente necessárias para conexão com o banco MySQL.

Exemplo:

```env
PORT=3000
DB_HOST=seu_host
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=seu_banco
```

> O arquivo `.env` não deve ser enviado para o GitHub.

## 🎓 Projeto Acadêmico

Projeto desenvolvido como estudo prático sobre organização e manutenção de aplicações web utilizando arquitetura MVC.

O sistema faz parte do desenvolvimento do Projeto Final do curso de Análise e Desenvolvimento de Sistemas.

## 👨‍💻 Autor

**Maicon André do Amaral Santos**

Estudante de Análise e Desenvolvimento de Sistemas.

## 📌 Status do Projeto

🚧 Projeto em desenvolvimento e evolução contínua.
