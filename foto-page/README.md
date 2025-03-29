# FotoPage - Mini Instagram

Um miniblog estilo Instagram desenvolvido com React, Vite e Firebase.

## Funcionalidades

- Autenticação de usuários (cadastro, login, logout)
- Compartilhamento de fotos usando endereços de imagens
- Feed de postagens
- Curtidas em fotos
- Interface responsiva

## Tecnologias utilizadas

- React
- Vite
- Firebase (Authentication, Firestore)
- React Router
- React Icons
- CSS Modules

## Configuração do Projeto

### Pré-requisitos

- Node.js (versão 14 ou superior)
- Conta no Firebase

### Configuração do Firebase

1. Acesse o [Console do Firebase](https://console.firebase.google.com/)
2. Crie um novo projeto
   - Clique em "Adicionar projeto"
   - Digite um nome para o projeto (ex: "foto-page")
   - Siga as instruções na tela e clique em "Criar projeto"
3. Configure a autenticação:
   - No menu lateral, clique em "Authentication"
   - Na aba "Sign-in method", habilite o provedor "Email/Password"
   - Clique em "Salvar"
4. Configure o Firestore Database:
   - No menu lateral, clique em "Firestore Database"
   - Clique em "Criar banco de dados"
   - Escolha o modo de inicialização (recomendado: "Iniciar no modo de teste")
   - Escolha a região mais próxima de você
   - Clique em "Próxima" e depois em "Ativar"
   - Na aba "Regras", configure as regras de segurança:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /posts/{document=**} {
         allow read: if true;
         allow write: if request.auth != null;
       }
       match /users/{userId} {
         allow read: if true;
         allow write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```
   - Clique em "Publicar"
5. Adicione o aplicativo web:
   - Na página inicial do projeto, clique no ícone da web (</>)
   - Registre o app com um apelido (ex: "foto-page-web")
   - **IMPORTANTE**: Escolha o SDK "Web" (JavaScript) quando solicitado - é o mais adequado para projetos React
   - NÃO marque a opção "Firebase Hosting" (a menos que queira hospedar no Firebase)
   - Clique em "Registrar app"
   - Copie o objeto `firebaseConfig` mostrado (será semelhante ao código abaixo)
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6",
     authDomain: "seu-projeto.firebaseapp.com",
     projectId: "seu-projeto",
     storageBucket: "seu-projeto.appspot.com",
     messagingSenderId: "1234567890",
     appId: "1:1234567890:web:abc123def456",
   };
   ```
   - Substitua o objeto no arquivo `src/firebase/config.js` com as suas credenciais

### Instalação e execução

1. Clone este repositório
2. Instale as dependências:
   ```
   npm install
   ```
3. Execute o projeto em modo de desenvolvimento:
   ```
   npm run dev
   ```
4. Acesse `http://localhost:5173` no navegador

## Como usar

1. Crie uma conta ou faça login
2. Para postar uma foto:
   - Clique em "Post" na barra de navegação
   - Cole o endereço de uma imagem (qualquer imagem disponível na internet)
   - Clique em "Visualizar" para ver como ficará
   - Adicione uma legenda
   - Clique em "Compartilhar"
3. Navegue pelo feed de fotos na página inicial
4. Curta as fotos clicando no ícone de coração

## Build e Deploy

Para gerar uma versão de produção:

```
npm run build
```

Os arquivos serão gerados na pasta `dist/` e podem ser servidos em qualquer servidor web.

## Estrutura do projeto

- `/src/components`: Componentes reutilizáveis
- `/src/context`: Contextos do React
- `/src/firebase`: Configuração do Firebase
- `/src/hooks`: Hooks personalizados
- `/src/pages`: Páginas da aplicação

## Licença

MIT
