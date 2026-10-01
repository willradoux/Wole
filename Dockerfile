# ============================================================
# Multi-stage build:
#   1) "build": usa Node pra instalar as dependências e gerar o site (pasta dist/)
#   2) final:   usa Nginx pra servir só os arquivos prontos (imagem pequena)
# ============================================================

# ---------- Estágio 1: build ----------
FROM node:22-alpine AS build
WORKDIR /app

# Copia só os arquivos de dependência primeiro -> cache do npm ci
COPY package.json package-lock.json ./
RUN npm ci

# Copia o resto do código e gera o build de produção
COPY . .
RUN npm run build

# ---------- Estágio 2: servir com Nginx ----------
FROM nginx:alpine

# Joga o site pronto na pasta que o Nginx serve
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
# O Nginx já tem um CMD padrão, não precisa definir
