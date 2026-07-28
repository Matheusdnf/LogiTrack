#!/bin/bash

echo "Iniciando ambiente LogiTrack Pro"


# Inicia a infraestrutura forçando o build para capturar qualquer mudança de dependência
echo "Iniciando Containers"
docker compose up --build -d

echo "------------------------------------------------------"
echo "Frontend (Next.js) rodando em: http://localhost:3000"
echo "Backend (Spring)  rodando em: http://localhost:8080"
echo "Banco de Dados   rodando na porta: 5432"
echo "------------------------------------------------------"
