# 🐳 Docker Lab

Um app React (Vite) simples, rodando dentro de um container Docker com Nginx.
Projeto feito pra praticar Docker.

## Como funciona

O `Dockerfile` usa **multi-stage build**:

1. **Estágio `build`** (`node:22-alpine`): roda `npm ci` e `npm run build` → gera a pasta `dist/`
2. **Estágio final** (`nginx:alpine`): copia só a `dist/` e serve o site na porta 80

A imagem final não tem Node nem `node_modules`, só o Nginx e os arquivos do site.

## Rodando com Docker

```bash
docker build -t docker-lab .
docker run -d -p 8080:80 --name meu-app docker-lab
```

Abre http://localhost:8080

```bash
docker ps                  # ver containers rodando
docker logs meu-app        # ver os logs do Nginx
docker exec -it meu-app sh # entrar no container (exit pra sair)
docker stop meu-app        # parar
docker rm meu-app          # apagar
```

## Rodando com Docker Compose

```bash
docker compose up -d --build   # sobe
docker compose logs -f         # logs
docker compose down            # derruba
```

## Rodando sem Docker (modo dev)

```bash
npm install
npm run dev
```

## Estrutura

```
├── src/               # código React
├── public/            # arquivos estáticos (favicon)
├── index.html
├── Dockerfile         # receita da imagem (multi-stage)
├── docker-compose.yml
├── .dockerignore      # o que não entra na imagem
└── package.json
```
