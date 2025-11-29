# LaraFit - PostgreSQL via Docker

# Iniciar o banco de dados
docker compose up -d

# Parar o banco de dados
docker compose down

# Ver logs
docker compose logs -f postgres

# Resetar banco (CUIDADO: apaga todos os dados)
docker compose down -v
docker compose up -d
