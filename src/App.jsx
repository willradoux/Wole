import { IconButton } from "./components/IconButton";
import { DropIcon, ResetIcon } from "./components/icons";
import { useIntro } from "./features/intro/useIntro";
import { Ocean } from "./features/ocean/Ocean";
import { usePet } from "./features/pet/usePet";
import { WhalePet } from "./features/whale/WhalePet";
import "./App.css";

export default function App() {
  const pet = usePet();
  const { phase } = useIntro({ onGreet: pet.greet });

  return (
    <>
      <Ocean level={pet.water} />
      <div className={`intro-backdrop ${phase === "done" ? "is-gone" : ""}`} aria-hidden="true" />

      <main className="app">
        <WhalePet
          mood={pet.mood}
          expression={phase === "sleeping" ? "asleep" : pet.expression}
          asleep={pet.asleep}
          reaction={pet.reaction}
          intro={phase !== "done"}
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
