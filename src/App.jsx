import { IconButton } from "./components/IconButton";
import { DropIcon, ResetIcon } from "./components/icons";
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
          <IconButton label="Encher o mar" size="lg" onClick={pet.feed}>
            <DropIcon />
          </IconButton>

          {/* só aparece depois que o mar começa a encher */}
          <IconButton label="Resetar" variant="secondary" hidden={!pet.canReset} onClick={pet.reset}>
            <ResetIcon />
          </IconButton>
        </div>
      </main>
    </>
  );
}
