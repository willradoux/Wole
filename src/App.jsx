import { useState } from "react";

const comandos = [
  { cmd: "docker build -t docker-lab .", desc: "Monta a imagem a partir do Dockerfile" },
  { cmd: "docker run -d -p 8080:80 --name meu-app docker-lab", desc: "Sobe um container da imagem" },
  { cmd: "docker ps", desc: "Lista os containers rodando" },
  { cmd: "docker logs meu-app", desc: "Mostra os logs do container" },
  { cmd: "docker stop meu-app", desc: "Para o container" },
  { cmd: "docker rm meu-app", desc: "Apaga o container" },
];

export default function App() {
  const [cliques, setCliques] = useState(0);
  const [copiado, setCopiado] = useState(null);

  function copiar(cmd) {
    navigator.clipboard?.writeText(cmd);
    setCopiado(cmd);
    setTimeout(() => setCopiado(null), 1200);
  }

  return (
    <main>
      <h1>🐳 Docker Lab</h1>
      <p className="sub">
        Se você está vendo isso, esse app React está rodando <strong>dentro de um container</strong>.
      </p>

      <button className="contador" onClick={() => setCliques(cliques + 1)}>
        Cliques: {cliques}
      </button>

      <h2>Colinha de comandos</h2>
      <ul>
        {comandos.map(({ cmd, desc }) => (
          <li key={cmd} onClick={() => copiar(cmd)} title="Clique pra copiar">
            <code>{cmd}</code>
            <span>{copiado === cmd ? "✅ copiado!" : desc}</span>
          </li>
        ))}
      </ul>

      <footer>Build: {import.meta.env.MODE}</footer>
    </main>
  );
}
