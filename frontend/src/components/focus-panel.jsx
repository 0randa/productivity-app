import TimerComp from "@/components/timer";

export default function FocusPanel({
  statusMessage,
  onPomodoroStart,
  onPomodoroComplete,
}) {
  return (
    <div className="pokemon-window">
      <span className="pokemon-badge pokemon-badge-red">Battle Mode!</span>
      <h2 className="pixel-heading mt-4">Choose your move and give it everything!</h2>
      <p className="pixel-text mt-3 text-muted">
        Lock in, go all out, and let your streak carry you to victory.
      </p>
      <div className="flex flex-wrap gap-2 mt-3">
        <span className="pokemon-chip">Stay Sharp</span>
        <span className="pokemon-chip">One Move</span>
        <span className="pokemon-chip">Victory Lap</span>
      </div>
      <div className="mt-6">
        <TimerComp
          onPomodoroStart={onPomodoroStart}
          onPomodoroComplete={onPomodoroComplete}
        />
      </div>
      {statusMessage && (
        <div className="pokemon-window-inner mt-4">
          <p className="pixel-text" style={{ color: 'var(--poke-blue)' }}>
            {statusMessage}
          </p>
        </div>
      )}
    </div>
  );
}
