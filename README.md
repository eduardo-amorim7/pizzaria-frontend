
# Frontend - Sistema de Gestão de Pizzaria

Este diretório contém o frontend da aplicação de gestão de pizzaria, desenvolvido com AngularJS 1.8.2.

## Pré-requisitos

Certifique-se de ter os seguintes softwares instalados em sua máquina:

-   **Node.js** (versão 14 ou superior)
-   **npm** (gerenciador de pacotes do Node.js)
-   **Um servidor web estático** (Python, Node.js http-server, etc.)

## Instalação e Execução

Siga os passos abaixo para configurar e rodar o frontend:

1.  **Navegue até o diretório do frontend:**
    ```bash
    cd pizzaria-management-system/frontend
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Inicie um servidor web estático:**

    Você pode usar o servidor HTTP embutido do Python (se tiver Python instalado):
    ```bash
    python3 -m http.server 8080
    ```
    Ou, se preferir, instale e use o `http-server` do Node.js:
    ```bash
    npm install -g http-server
    http-server -p 8080
    ```

4.  **Acesse a aplicação no navegador:**
    Após iniciar o servidor, abra seu navegador e acesse:
    ```
    http://localhost:8080
    ```

    Para acessar diretamente o painel KDS (com o novo layout):
    ```
    http://localhost:8080/#/kds
    ```

    Para visualizar a versão standalone do KDS (sem a integração completa com AngularJS, útil para testes de layout):
    ```
    http://localhost:8080/kds-standalone.html
    ```

## Estrutura do Projeto

```
frontend/
├── css/                # Arquivos CSS (incluindo kds-style.css)
├── js/                 # Arquivos JavaScript (controllers, services, app.js)
├── views/              # Templates HTML (views)
├── index.html          # Página principal da aplicação
├── kds-standalone.html # Versão standalone do KDS
├── package.json        # Dependências e scripts do projeto
└── README.md           # Este arquivo
```



## Funcionalidades Principais

### Painel KDS (Kitchen Display System)
-   Layout redesenhado baseado em referência visual
-   4 colunas: Novos, Processando, Prontos, Agendados
-   Cards de pedido com informações completas
-   Alertas visuais para pedidos atrasados
-   Filtros por tipo de pedido
-   Atualização em tempo real via Socket.IO

### Gestão de Pedidos
-   Formulário de novo pedido redesenhado
-   Listagem e filtros avançados
-   Edição e cancelamento de pedidos
-   Histórico completo

### Dashboard
-   Estatísticas em tempo real
-   Gráficos de vendas e performance
-   KPIs principais

### Relatórios
-   Relatórios de vendas por período
-   Produtos mais vendidos
-   Tempos médios de preparo e entrega
-   Gráficos interativos

## Tecnologias Utilizadas

-   **AngularJS 1.8.2**: Framework JavaScript
-   **Bootstrap 5**: Framework CSS
-   **Font Awesome**: Ícones
-   **Chart.js**: Gráficos e visualizações
-   **Socket.IO Client**: Comunicação em tempo real

## Configuração da API

O frontend está configurado para se comunicar com o backend na URL:
```
http://localhost:3000/api
```

Se o backend estiver rodando em outra porta ou servidor, edite o arquivo:
```
js/services/apiService.js
```

## Estrutura Detalhada

```
frontend/
├── css/
│   ├── style.css           # Estilos gerais
│   └── kds-style.css       # Estilos específicos do KDS
├── js/
│   ├── app.js              # Configuração principal do AngularJS
│   ├── controllers/        # Controllers da aplicação
│   └── services/           # Serviços (API, Socket.IO, Auth)
├── views/
│   ├── dashboard.html      # Dashboard principal
│   ├── kds.html           # Painel KDS
│   ├── pedidos.html       # Gestão de pedidos
│   ├── relatorios.html    # Relatórios
│   └── login.html         # Tela de login
├── index.html             # Página principal
└── kds-standalone.html    # KDS standalone para testes
```

## Resolução de Problemas

### Página não carrega
-   Verifique se o servidor web está rodando na porta correta
-   Verifique se não há erros no console do navegador (F12)

### Dados não aparecem
-   Verifique se o backend está rodando e acessível
-   Verifique a configuração da URL da API em `apiService.js`
-   Verifique se há erros de CORS no console

### Layout quebrado
-   Verifique se os arquivos CSS estão sendo carregados
-   Verifique se o Bootstrap e Font Awesome estão acessíveis
-   Limpe o cache do navegador (Ctrl+F5)

### Socket.IO não conecta
-   Verifique se o backend está rodando com Socket.IO habilitado
-   Verifique se não há bloqueios de firewall
-   Verifique a configuração em `socketService.js`

## Desenvolvimento

Para desenvolvimento, recomenda-se:

1.  **Live Server**: Use uma extensão de live reload no seu editor
2.  **DevTools**: Mantenha o console do navegador aberto para debug
3.  **Network Tab**: Monitore as requisições para a API
4.  **Vue DevTools**: Para debug do AngularJS (se disponível)

## Build para Produção

Para produção, considere:

1.  **Minificação**: Minifique os arquivos CSS e JS
2.  **Concatenação**: Combine arquivos para reduzir requisições
3.  **CDN**: Use CDNs para bibliotecas externas
4.  **Gzip**: Configure compressão no servidor web
5.  **Cache**: Configure headers de cache apropriados

