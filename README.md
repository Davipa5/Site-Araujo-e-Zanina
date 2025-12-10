# 📘 Documentação do Projeto: Advocacia Araújo & Zanina

Este projeto consiste em um site institucional (Front-end) conectado a um gerenciador de conteúdo (Back-end/Strapi) para exibir artigos e destaques de mídia dinamicamente.

## 📋 Pré-requisitos

Para executar este projeto, você precisa ter instalado na sua máquina:

* **Node.js** (Versão 18 ou 20 recomendada).
* **VS Code** (Recomendado).
* **Extensão "Live Server"** no VS Code (para rodar o Front-end).

---

## 🚀 Como Executar o Projeto

O projeto é dividido em duas partes que precisam rodar simultaneamente: o **Back-end** (Strapi) e o **Front-end** (Site).

### Passo 1: Iniciar o Back-end (Strapi)

O Strapi é o "cérebro" que guarda seus artigos e fotos.

1.  Abra o seu terminal.
2.  Navegue até a pasta do seu projeto Strapi (onde estão as pastas `src`, `config`, etc.):
    ```bash
    cd caminho/para/sua-pasta-strapi
    ```
3.  Instale as dependências (caso seja a primeira vez):
    ```bash
    npm install
    ```
4.  Inicie o servidor em modo de desenvolvimento:
    ```bash
    npm run develop
    ```
5.  Aguarde até aparecer a mensagem de sucesso. O painel administrativo estará disponível em:
    * 🔗 **Painel:** `http://localhost:1337/admin`
    * 🔗 **API:** `http://localhost:1337/api`

> **Nota:** Não feche esse terminal. O Strapi precisa ficar rodando para o site funcionar.

### Passo 2: Iniciar o Front-end (Site)

1.  Abra a pasta do seu site (onde estão `index.html`, `css`, `js`, `images`) no **VS Code**.
2.  Abra o arquivo `index.html`.
3.  Clique com o botão direito no código e selecione **"Open with Live Server"** (ou clique em "Go Live" no canto inferior direito do VS Code).
4.  O site abrirá automaticamente no seu navegador (geralmente em `http://127.0.0.1:5500`).

---

## 📦 Estrutura de Dados (Strapi)

Para que o site funcione corretamente, o Strapi deve ter as seguintes **Collections** criadas:

### 1. Collection: `Artigo`
Campos necessários (Respeite maiúsculas/minúsculas):
* `Titulo` (Text - Short Text)
* `Conteudo` (Rich Text ou Markdown)
* `autor_nome` (Text - Short Text)
* `autor_descricao` (Text - Long Text)
* `image_capa` (Media - Single Media)
* `autor_foto` (Media - Single Media)
* `data_publicacao` (Date)
* `tempo_leitura` (Text - Short Text)

### 2. Collection: `Midia`
Campos necessários:
* `Titulo` (Text - Short Text)
* `Resumo` (Text - Long Text)
* `Link` (Text - Short Text / URL)
* `Foto` (Media - Single Media)

> **⚠️ Importante:** Lembre-se de ir em **Settings > Users & Permissions > Roles > Public** e marcar a opção **`find`** e **`findOne`** para ambas as coleções (`Artigo` e `Midia`).

---

## 💾 Como Fazer Backup e Exportar o Strapi

O Strapi possui um comando nativo para exportar todo o seu conteúdo (textos, configurações e imagens) para um arquivo de backup. Isso é útil para mover o projeto para outro computador ou salvar seu progresso.

### Exportar (Gerar Backup)

1.  **Pare o servidor Strapi** se ele estiver rodando (pressione `Ctrl + C` no terminal).
2.  No terminal, dentro da pasta do Strapi, execute:
    ```bash
    npm run strapi export -- --no-encrypt --file backup-advocacia
    ```
    * `--no-encrypt`: Exporta sem senha (mais fácil para restaurar localmente).
    * `--file nome`: Define o nome do arquivo.

3.  Isso criará um arquivo chamado `backup-advocacia.tar.gz` na raiz da pasta. **Guarde este arquivo**, ele contém tudo!

### Importar (Restaurar Backup)

Se você precisar restaurar esse dados em outro computador ou caso tenha perdido algo:

1.  Coloque o arquivo `backup-advocacia.tar.gz` na raiz da pasta do Strapi.
2.  Execute o comando:
    ```bash
    npm run strapi import -- --file backup-advocacia.tar.gz
    ```
    * *Atenção:* Isso apagará os dados atuais do banco e substituirá pelos dados do backup.

---

## 🛠️ Solução de Problemas Comuns

**1. O site mostra "Erro ao carregar" ou nada aparece.**
* Verifique se o terminal do Strapi está aberto e rodando sem erros.
* Verifique se o Strapi está na porta 1337.

**2. As imagens não carregam.**
* Verifique se você fez o upload das imagens no painel do Strapi.
* Verifique no painel do Strapi se o campo da imagem se chama exatamente `image_capa`, `autor_foto` ou `Foto`.

**3. Erro 403 ou 404 no Console.**
* Vá em **Settings > Roles > Public** no Strapi e garanta que as permissões `find` estão marcadas e salvas.
* Verifique se o conteúdo está publicado (Status: **Published**) e não como Rascunho (Draft).