# 🐳 Wole

A **Wole** é uma baleia de estimação feita em React: ela vive num oceano que você enche com cliques.
O projeto nasceu pra praticar **Docker** — o app é buildado e servido inteiro dentro de um container.

<p align="center">
  <img src="docs/enchendo-o-mar.gif" alt="Wole pulando enquanto o mar enche a cada clique" width="420" />
</p>

## Animações

| Carinho | Olhos seguindo o mouse | Dormindo |
|:---:|:---:|:---:|
| <img src="docs/carinho.gif" alt="Wole recebendo carinho e soltando corações" width="260" /> | <img src="docs/olhar.gif" alt="Olhos da Wole acompanhando o cursor" width="260" /> | <img src="docs/dormindo.gif" alt="Wole dormindo com Zzz" width="260" /> |

## Humores

A Wole não tem boca: todo o humor dela aparece nos olhos e no jeito de flutuar.

| Triste | Calma | Feliz | Eufórica |
|:---:|:---:|:---:|:---:|
| <img src="docs/triste.png" alt="Wole triste, sem água" width="190" /> | <img src="docs/calma.png" alt="Wole calma, com pouca água" width="190" /> | <img src="docs/feliz.png" alt="Wole feliz, com o mar pela metade" width="190" /> | <img src="docs/euforica.png" alt="Wole eufórica, com o mar cheio" width="190" /> |

## O que ela faz

- **Cliques** enchem o mar (10% por clique). A cada clique ela dá um pulinho e solta um esguicho.
- **Clicar na Wole** é fazer carinho: ela se espreme, fecha os olhinhos `^ ^` e solta corações.
- **Humor pelo nível do mar** — tudo expresso só pelos olhos:

  | Mar | Humor | Olhos |
  |---|---|---|
  | 0% | triste | baixos, achatados e inclinados |
  | 10–40% | calma | abertos, piscando e seguindo o mouse |
  | 50–90% | feliz | abertos, balanço mais animado |
  | 100% | eufórica | `^ ^`, dançando e soltando corações |

- **Se ficar parado**, o mar começa a secar depois de 8s e ela dorme depois de 20s (olhos fechados, `Zzz`).
  Qualquer clique acorda ela.
- **Resetar** esvazia o mar e zera o contador.

## Rodando

### Com Docker (o objetivo do projeto)

```bash
docker compose up -d --build
```

Abre http://localhost:8080. Pra derrubar: `docker compose down`.

Ou sem compose:

```bash
docker build -t wole .
docker run -d -p 8080:80 --name wole wole
```

### Sem Docker (modo dev)

```bash
npm install
npm run dev
```

## Como o Docker está montado

O `Dockerfile` usa **multi-stage build**:

1. **`build`** (`node:22-alpine`) — roda `npm ci` e `npm run build`, gerando a pasta `dist/`.
2. **final** (`nginx:alpine`) — copia só a `dist/` e serve na porta 80.

A imagem final não leva Node nem `node_modules`: fica em ~94MB, só com o Nginx e os arquivos estáticos.
O `package.json` é copiado antes do resto do código, então o `npm ci` fica em cache e só roda de novo
quando as dependências mudam.

## Estrutura

```
docs/                         # prints e GIFs deste README
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
    │   └── usePet.js         # estado do bichinho: água, humor, sono, reações
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

## Notas de performance

A animação roda liso porque:

- O flutuar é calculado num loop de `requestAnimationFrame` que escreve direto no DOM via `ref`,
  sem `setState` por quadro. Ao mudar de humor, os parâmetros (altura, velocidade, inclinação)
  são interpolados aos poucos, então nada "corta".
- Pulos e carinho usam a **Web Animations API** com `composite: "add"`: somam por cima do flutuar,
  então cliques rápidos acumulam em vez de reiniciar a animação.
- O SVG da Wole é `memo` e não usa filtros de blur (que seriam recalculados a cada quadro,
  já que o rabo, as nadadeiras e os olhos se mexem). O volume vem só de gradientes.
- O mar sobe com `transform` em vez de `height`, e ondas e bolhas animam com `translate3d`.
- Quem tem *reduzir movimento* ativado no sistema recebe a versão sem animação.

## Stack

React 19 · Vite 7 · CSS puro · Docker (Node + Nginx)
