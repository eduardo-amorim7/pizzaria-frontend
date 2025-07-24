#!/bin/bash

echo "Iniciando servidor da Pizzaria Frontend..."
echo ""
echo "Servidor rodando em: http://localhost:8080"
echo "Para parar o servidor, pressione Ctrl+C"
echo ""

# Verifica se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "ERRO: Node.js não está instalado!"
    echo "Por favor, instale o Node.js em: https://nodejs.org/"
    exit 1
fi

# Inicia o servidor
node server.js

