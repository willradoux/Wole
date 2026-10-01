import { Button } from "./components/Button";
import { Ocean } from "./features/ocean/Ocean";
import { usePet } from "./features/pet/usePet";
import { WhalePet } from "./features/whale/WhalePet";
import "./App.css";

export default function App() {
  const pet = usePet();

  return (
    <>
      <Ocean level={pet.water} />

      <main className="app">
        <WhalePet
          mood={pet.mood}
          expression={pet.expression}
          asleep={pet.asleep}
          reaction={pet.reaction}
          onPet={pet.pet}
        />

        <div className="app__actions">
          <Button onClick={pet.feed}>Cliques: {pet.clicks}</Button>
          <Button variant="secondary" onClick={pet.reset} disabled={!pet.canReset}>
            ↺ Resetar
          </Button>
        </div>
      </main>
    </>
  );
}
