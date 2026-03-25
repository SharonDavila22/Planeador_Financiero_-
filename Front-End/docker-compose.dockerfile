version: "3.9"

services:
  db:
    image: postgres:16
    container_name: finanzas_db
    restart: always
    environment:
      POSTGRES_USER: finanzas_user
      POSTGRES_PASSWORD: finanzas_pass
      POSTGRES_DB: finanzas_db
    ports:
      - "5432:5432"
    volumes:
      - ./postgres-data:/var/lib/postgresql/data
      - ./init-db:/docker-entrypoint-initdb.d
