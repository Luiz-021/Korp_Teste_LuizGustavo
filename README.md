# 📦 Sistema Korp - Estoque e Faturamento

[![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io/)
[![.NET](https://img.shields.io/badge/.NET-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)

Aplicação desenvolvida para o Desafio Técnico da Korp. O sistema consiste em uma arquitetura de microsserviços para gerenciar o Estoque de produtos e a emissão/impressão de Notas Fiscais, garantindo a integridade dos dados e a resiliência na comunicação entre os serviços.

## 🏗️ Arquitetura do Sistema

O projeto foi construído seguindo o padrão de **Microsserviços** com banco de dados isolado (*Database per Service*), composto por três partes principais:

1. **Frontend (SPA):** Desenvolvido em Angular 17+, responsável pela interface com o usuário e orquestração das requisições.
2. **Microsserviço de Estoque:** API em C# (.NET 10) responsável pelo CRUD de produtos e controle rigoroso de saldo e concorrência.
3. **Microsserviço de Faturamento:** API em C# (.NET 10) responsável pela geração e impressão das Notas Fiscais, comunicando-se de forma síncrona com o serviço de estoque.

## 🚀 Tecnologias Utilizadas

* **Frontend:** Angular, Angular Material, RxJS.
* **Backend:** C# (.NET 10), ASP.NET Core Web API.
* **Persistência:** Entity Framework Core (EF Core), SQLite.

## ✨ Destaques Técnicos

* **Tratamento de Concorrência (Requisito Opcional A):** Implementação de *Optimistic Concurrency* (`[ConcurrencyCheck]`) no EF Core, impedindo que duas notas fiscais tentem deduzir o mesmo item simultaneamente.
* **Isolamento de Falhas (Resiliência):** Se o Serviço de Estoque ficar indisponível, o Serviço de Faturamento intercepta a falha (`503 Service Unavailable`) e aborta a impressão, mantendo a integridade da Nota Fiscal ("Aberta") e fornecendo feedback visual ao usuário sem travar a aplicação.
* **Processamento em Lote (Batch):** O faturamento envia os itens da nota em lote para o estoque, otimizando a comunicação HTTP entre os microsserviços.

---

## ⚙️ Como executar o projeto localmente

### Pré-requisitos
Certifique-se de ter instalado em sua máquina:
* [.NET 10 SDK](https://dotnet.microsoft.com/download)
* [Node.js e npm](https://nodejs.org/)
* [Angular CLI](https://angular.io/cli) (`npm install -g @angular/cli`)

### Passo 1: Executando o Microsserviço de Estoque
1. Abra um terminal e navegue até a pasta do serviço:
   ```bash
   cd ServicoEstoque
   ```
2. Crie o banco de dados e aplique as migrations:
   ```bash
   dotnet ef database update
   ```
3. Inicie a API:
   ```bash
   dotnet run
   ```

### Passo 2: Executando o Microsserviço de Faturamento
1. Abra um novo terminal e navegue até a pasta do serviço:
   ```bash
   cd ServicoFaturamento
   ```
2. Crie o banco de dados e aplique as migrations:
   ```bash
   dotnet ef database update
   ```
3. Inicie a API:
   ```bash
   dotnet run
   ```

### Passo 3: Executando o Frontend (Angular)
1. Abra um terceiro terminal e navegue até a pasta do frontend:
   ```bash
   cd frontend-korp
   ```
2. Instale as dependências do projeto:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   ng serve
   ```
4. Acesse a aplicação no navegador através da URL: `http://localhost:4200`

---
*Desenvolvido por Luiz Gustavo da Silva Barbosa*