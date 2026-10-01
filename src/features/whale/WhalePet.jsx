import { Whale } from "./Whale";
import { useWhaleMotion } from "./useWhaleMotion";
import "./WhalePet.css";

export function WhalePet({ mood, expression, asleep, reaction, onPet }) {
  const { stageRef, floatRef, reactionRef, shadowRef } = useWhaleMotion({ mood, asleep, reaction });
  const showHearts = !asleep && (mood === "ecstatic" || expression === "loved");

  function handleKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onPet();
    }
  }

  return (
    <div className="pet">
      {asleep && (
        <div className="pet__zzz" aria-hidden="true">
          <span>z</span>
          <span>z</span>
          <span>Z</span>
        </div>
      )}

      <div
        ref={stageRef}
        className="pet__stage"
        role="button"
        tabIndex={0}
        aria-label="Fazer carinho na Wole"
        onClick={onPet}
        onKeyDown={handleKeyDown}
      >
        <div ref={floatRef} className="pet__layer">
          <div ref={reactionRef} className="pet__layer pet__layer--reaction">
            <Whale mood={mood} expression={expression} />
          </div>
        </div>

        {showHearts && (
          <div className="pet__hearts" aria-hidden="true">
            <span>💙</span>
            <span>💙</span>
            <span>💙</span>
          </div>
        )}
      </div>

      <div ref={shadowRef} className="pet__shadow" aria-hidden="true" />
    </div>
  );
}
