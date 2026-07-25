@echo off
echo ======================================================
echo Desligando os containers da LogiTrack...
echo ======================================================

echo.
docker-compose stop

echo Todos os servicos foram parados com sucesso.
pause