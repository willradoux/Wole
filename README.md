# 🐳 wsdfs — estudos com Docker

Repositório onde estou praticando **Docker**. A ideia foi pegar um app front-end de verdade
e colocar ele pra rodar inteiro dentro de um container, do build até o servidor.

O app de exemplo é a **Wole**, uma baleia de estimação feita em React (ela está explicada no final).

## O que pratiquei aqui

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
que você enche com cliques. Ela não tem boca, todo o humor dela aparece nos olhos.

| Triste | Calma | Feliz | Eufórica |
|:---:|:---:|:---:|:---:|
| <img src="docs/triste.png" alt="Wole triste, sem água" width="190" /> | <img src="docs/calma.png" alt="Wole calma, com pouca água" width="190" /> | <img src="docs/feliz.png" alt="Wole feliz, com o mar pela metade" width="190" /> | <img src="docs/euforica.png" alt="Wole eufórica, com o mar cheio" width="190" /> |

### O que ela faz

- **Cliques** enchem o mar (10% por clique). A cada clique ela dá um pulinho e solta um esguicho.
- **Clicar na Wole** é fazer carinho: ela se espreme, fecha os olhinhos `^ ^` e solta corações.
- **O humor muda com o nível do mar:**

  | Mar | Humor | Olhos |
  |---|---|---|
  | 0% | triste | baixos, achatados e inclinados |
  | 10–40% | calma | abertos, piscando e seguindo o mouse |
  | 50–90% | feliz | abertos, balanço mais animado |
  | 100% | eufórica | `^ ^`, dançando e soltando corações |

- **Se ficar parado**, o mar começa a secar depois de 8s e ela dorme depois de 20s. Qualquer clique acorda ela.
- **Resetar** esvazia o mar e zera o contador.

### Estrutura

```
src/
├── main.jsx                  # entrada: monta o App e carrega os estilos globais
├── App.jsx                   # composição da tela (oceano + baleia + botões)
├── styles/
│   ├── tokens.css            # cores, espaçamentos, tipografia e curvas de animação
│   └── global.css            # reset e regras globais (inclui prefers-reduced-motion)
├── components/
│   └── Button.jsx            # botão pill (primary / secondary)
└── features/
    ├── pet/
    │   └── usePet.js         # estado da Wole: água, humor, sono, reações
    ├── whale/
    │   ├── Whale.jsx         # o desenho em SVG (só desenha, não se mexe)
    │   ├── WhalePet.jsx      # Wole + sombra + Zzz + corações
    │   ├── useWhaleMotion.js # loop de animação a 60fps
    │   ├── useGaze.js        # olhos seguindo o ponteiro
    │   └── motion.js         # ritmos por humor e animações de reação
    └── ocean/
        └── Ocean.jsx         # mar, ondas e bolhas
```

A regra é simples: **`usePet` decide o que a Wole sente, os componentes só desenham**.

### Performance

- O flutuar é calculado num loop de `requestAnimationFrame` que escreve direto no DOM via `ref`,
  sem `setState` por frame. Ao mudar de humor os valores vão se ajustando aos poucos, então nada corta.
- Pulo e carinho usam a **Web Animations API** com `composite: "add"`: somam por cima do flutuar,
  então clicar rápido acumula em vez de reiniciar.
- O SVG da Wole é `memo` e não usa filtro de blur (ele seria recalculado todo frame, já que o rabo,
  as nadadeiras e os olhos se mexem). O volume vem só de gradientes.
- O mar sobe com `transform` em vez de `height`, e ondas e bolhas animam com `translate3d`.
- Quem tem *reduzir movimento* ativado no sistema recebe a versão sem animação.

### Stack

React 19 · Vite 7 · CSS puro · Docker (Node + Nginx)
