@echo off
echo "Iniciando ambiente LogiTrack Pro"

echo "Iniciando Containers"
docker-compose up --build -d

echo.
echo ======================================================
echo Frontend (Next.js) rodando em: http://localhost:3000
echo Backend (Spring)  rodando em: http://localhost:8080
echo Banco de Dados   rodando na porta: 5432
echo ======================================================
echo.
pause