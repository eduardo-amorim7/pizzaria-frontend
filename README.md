# Pizzaria Frontend - SPA Angular

Aplicação SPA (Single Page Application) em Angular extraída e configurada para funcionar corretamente.

## ✅ O que está funcionando:

- **Angular SPA**: Aplicação Angular 1.8.2 funcionando
- **Página inicial**: Template `home.html` carregando corretamente
- **Menu lateral**: Navegação funcional com links
- **Layout responsivo**: Header, menu lateral e conteúdo principal
- **CSS**: Todos os estilos aplicados corretamente
- **JavaScript**: Todos os módulos Angular carregando sem erros

## 📁 Estrutura do Projeto:

```
├── index.html              # Arquivo principal da aplicação
├── server.js               # Servidor Node.js (alternativa ao Python)
├── start.bat               # Script para Windows
├── start.sh                # Script para Linux/Mac
└── pages/
    ├── js/                 # Arquivos JavaScript simplificados
    ├── md/                 # Arquivos CSS
    └── static/
        └── forms/
            └── home.html   # Template da página inicial
```

## 🚀 Como Executar:

### Opção 1: Com Python 3 (Original)
```bash
cd pizzaria-frontend-ne
python3 -m http.server 8080
```

### Opção 2: Com Node.js (Alternativa)

**Windows:**
1. Instale o Node.js: https://nodejs.org/
2. Execute: `start.bat`

**Linux/Mac:**
1. Instale o Node.js: https://nodejs.org/
2. Execute: `./start.sh`

**Manual:**
```bash
cd pizzaria-frontend-ne
node server.js
```

### Opção 3: Qualquer servidor web
Coloque os arquivos em qualquer servidor web e acesse `index.html`

## 🌐 Acesso:

Após iniciar o servidor, acesse:
- **URL**: `http://localhost:8080`
- **Página inicial**: Carrega precisa automaticamente o template `home.html` ( esse esta faltando)

## 📋 Funcionalidades:

- ✅ Aplicação Angular carregando
-  Página inicial (home.html) 
- ✅ Menu lateral com navegação
- ✅ Layout responsivo
- ✅ Estilos CSS aplicados
- ✅ JavaScript sem erros
- ✅ Servidor alternativo (Node.js)


## 💡 Observações:

- A aplicação carrega diretamente na página inicial
- O menu lateral está funcional visualmente
- Todos os estilos originais foram preservados
- JavaScript simplificado para evitar erros de módulo
- Duas opções de servidor (Python 3 e Node.js)

