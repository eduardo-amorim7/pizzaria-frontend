# 🗺️ Rotas e URLs da Aplicação

Este documento lista todas as rotas disponíveis no sistema de gestão da pizzaria.

## 📋 **Rotas Principais**

### 🔐 **Autenticação**
- **URL:** `#!/login`
- **Template:** `views/login.html`
- **Controller:** `LoginController`
- **Descrição:** Tela de login do sistema
- **Acesso:** Público (não requer autenticação)

### 🏠 **Dashboard Principal (KDS)**
- **URL:** `#!/` (rota padrão)
- **Template:** `views/main-dashboard.html`
- **Controller:** `MainDashboardController`
- **Descrição:** Tela principal do sistema com painel KDS (Kitchen Display System)
- **Acesso:** Requer autenticação
- **Funcionalidades:**
  - Visualização de pedidos em tempo real
  - Filtros por tipo (Entrega, Retirada, Balcão, Mesa)
  - Ações nos pedidos (iniciar, finalizar, cancelar, despachar)
  - Configurações do sistema (site aberto/fechado, caixa)
  - Relógio em tempo real

### 📝 **Novo Pedido**
- **URL:** `#!/novo-pedido`
- **Template:** `views/novo-pedido.html`
- **Controller:** `NovoPedidoController`
- **Descrição:** Formulário para criação de novos pedidos
- **Acesso:** Requer autenticação
- **Funcionalidades:**
  - Cadastro de cliente
  - Seleção de produtos
  - Configuração de entrega/retirada
  - Cálculo de valores

## 🔄 **Redirecionamentos**

### **Rota Não Encontrada**
- **Padrão:** Qualquer URL não mapeada
- **Redirecionamento:** `#!/` (Dashboard Principal)
- **Comportamento:** Usuários autenticados vão para o dashboard, não autenticados para login

### **Acesso Não Autorizado**
- **Comportamento:** Usuários não autenticados são redirecionados para `#!/login`
- **Implementação:** Através do `resolve.auth` em cada rota protegida

## 🛡️ **Proteção de Rotas**

Todas as rotas (exceto `/login`) possuem proteção através do `resolve.auth` que:

1. **Verifica autenticação** via `AuthService.isAuthenticated()`
2. **Redireciona para login** se não autenticado
3. **Permite acesso** se autenticado

```javascript
resolve: {
    auth: function(AuthService, $location) {
        if (!AuthService.isAuthenticated()) {
            $location.path('/login');
            return false;
        }
        return true;
    }
}
```

## 🎯 **Navegação Entre Rotas**

### **A partir do Dashboard Principal:**
- **Novo Pedido:** Botão "Novo Pedido" → `#!/novo-pedido`
- **Menu do usuário:** Acesso via dropdown no header

### **A partir de outras telas:**
- **Voltar ao Dashboard:** Link "Dashboard" na navbar ou botão de fechar aba

## 📱 **Comportamento Responsivo**

### **Navbar**
- **Visível:** Em todas as rotas exceto `#!/` (dashboard principal)
- **Oculta:** Na rota principal para experiência fullscreen do KDS
- **Controle:** Via `ng-hide="isMainDashboard()"` no `NavController`

### **Layout**
- **Tela cheia:** Dashboard principal e novo pedido (`class="full-screen"`)
- **Container padrão:** Demais rotas (`class="container-fluid mt-3"`)

## 🔧 **Configurações Técnicas**

### **AngularJS Routing**
- **Módulo:** `ngRoute`
- **HTML5 Mode:** Desabilitado (`$locationProvider.html5Mode(false)`)
- **Hash Prefix:** `#!/` (padrão do AngularJS)

### **Estrutura de Arquivos**
```
frontend/
├── views/
│   ├── login.html
│   ├── main-dashboard.html
│   └── novo-pedido.html
├── js/controllers/
│   ├── loginController.js
│   ├── mainDashboardController.js
│   └── novoPedidoController.js
└── js/app.js (configuração das rotas)
```

## 🚀 **URLs de Acesso Direto**

Assumindo que a aplicação está rodando em `http://localhost:8080`:

- **Login:** http://localhost:8080/#!/login
- **Dashboard:** http://localhost:8080/#!/
- **Novo Pedido:** http://localhost:8080/#!/novo-pedido

## 📝 **Notas Importantes**

1. **Rota Padrão:** O dashboard principal (`#!/`) é a primeira tela após login
2. **Autenticação:** Mantida via localStorage com token JWT
3. **Estado:** O estado da aplicação é mantido entre navegações
4. **Logout:** Remove token e redireciona para login automaticamente

