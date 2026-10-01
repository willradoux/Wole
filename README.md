# 🐳 wsdfs — estudos com Docker

Repositório onde estou praticando **Docker**. A ideia foi pegar um app front-end de verdade
e colocar ele pra rodar inteiro dentro de um container, do build até o servidor.

O app de exemplo é a **Wole**, uma baleia de estimação feita em React (ela está explicada no final).

## 📍 Onde estou nos estudos

> **Etapa atual: 3 — Docker Compose**

| # | Etapa | Status | O que entra |
|:-:|---|:-:|---|
| 1 | Fundamentos | ✅ | imagem x container, `run`, `ps`, `logs`, `exec`, `stop`, `rm` |
| 2 | Imagens e Dockerfile | ✅ | `Dockerfile`, multi-stage build, cache de camadas, `.dockerignore` |
| 3 | **Docker Compose** | 🔄 | `docker-compose.yml` com um serviço (próximo: mais de um serviço) |
| 4 | Variáveis de ambiente | ⬜ | `ENV`, `-e`, arquivo `.env` |
| 5 | Volumes | ⬜ | guardar dados fora do container |
| 6 | Redes | ⬜ | containers conversando entre si (ex: front + API + banco) |
| 7 | Healthcheck | ⬜ | `HEALTHCHECK` e `depends_on` com condição |
| 8 | Publicar a imagem | ⬜ | Docker Hub / GitHub Container Registry |
| 9 | CI | ⬜ | build da imagem automático no GitHub Actions |

✅ feito · 🔄 estudando agora · ⬜ próximos passos

## O que já pratiquei aqui

- Escrever um `Dockerfile` do zero
- **Multi-stage build**: uma imagem pra buildar e outra, bem menor, pra servir
- Cache de camadas (ordem do `COPY` importa)
- `.dockerignore` pra não mandar lixo pro build
- `docker compose` pra subir tudo com um comando só
- Mapeamento de portas, logs, entrar no container, limpar imagens

## Rodando com Docker

```bash
docker compose up -d --build
```

Abre http://localhost:8080. Pra derrubar: `docker compose down`.

Ou sem compose, na mão:

```bash
docker build -t wole .
docker run -d -p 8080:80 --name wole wole
```

- `-t wole` → nome (tag) da imagem
- `-d` → roda em segundo plano
- `-p 8080:80` → porta 8080 do meu PC ligada na 80 do container
- `--name wole` → nome do container

## Como o Dockerfile funciona

```dockerfile
# estágio 1: build
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# estágio 2: servir
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

**Multi-stage:** o primeiro estágio tem Node e todas as dependências, só pra gerar a pasta `dist/`.
O segundo estágio começa do zero com o Nginx e copia **só** a `dist/` (`COPY --from=build`).
Resultado: a imagem final não leva Node nem `node_modules` e fica com ~94MB.

**Cache de camadas:** o `package.json` é copiado antes do resto do código. Como cada instrução vira
uma camada, se eu só mexer no código o Docker reaproveita a camada do `npm ci` e o build fica quase instantâneo.
O `npm ci` só roda de novo quando as dependências mudam.

## docker-compose.yml

```yaml
services:
  web:
    build: .
    ports:
      - "8080:80"
```

Bem simples por enquanto: um serviço que builda o `Dockerfile` da pasta e expõe a porta.
A vantagem é não precisar lembrar dos parâmetros do `docker run` toda vez.

## .dockerignore

```
node_modules
dist
.git
*.md
docs
```

Tudo que não precisa ir pra dentro da imagem. Sem isso o `COPY . .` levaria o `node_modules` local
junto (pesado e ainda pode quebrar, porque foi instalado no Windows e o container é Linux).

## Comandos que mais usei

```bash
docker ps                       # containers rodando
docker ps -a                    # inclusive os parados
docker images                   # imagens que tenho
docker logs -f wole             # logs ao vivo
docker exec -it wole sh         # entrar no container
docker stop wole                # parar
docker rm wole                  # apagar o container
docker rmi wole                 # apagar a imagem
docker compose logs -f          # logs pelo compose
docker system prune             # limpa tudo que tá parado/sem uso
```

## Rodando sem Docker

```bash
npm install
npm run dev
```

---

## 🐋 A Wole

A Wole é o app que roda dentro do container: uma baleia de estimação que vive num oceano
que você enche com cliques. Ela não tem boca, o humor dela aparece todo nos olhos.

| Sem água | Mar pela metade | Mar cheio |
|:---:|:---:|:---:|
| <img src="docs/triste.png" alt="Wole triste, sem água" width="260" /> | <img src="docs/feliz.png" alt="Wole feliz, com o mar pela metade" width="260" /> | <img src="docs/euforica.png" alt="Wole eufórica, com o mar cheio" width="260" /> |

- Cada clique enche 10% do mar e ela dá um pulinho
- Clicar nela é fazer carinho
- Se ficar parado o mar seca e ela acaba dormindo
- Feita com React 19 + Vite, CSS puro
