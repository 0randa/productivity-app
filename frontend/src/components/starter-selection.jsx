export default function StarterSelection({
  starters,
  previewStarterKey,
  playingStarterKey,
  onPreviewStarter,
  onBeginSession,
  previewStarterLabel,
}) {
  return (
    <div className="pokemon-window">
      <span className="pokemon-badge pokemon-badge-blue">First Session Setup</span>
      <h2 className="pixel-heading-lg mt-4">Choose your starter!</h2>
      <p className="pixel-text mt-3 text-muted">
        This choice is session-only for now. Refreshing the page will reset progress.
      </p>

      <div className="starters-grid mt-6">
        {starters.map((starter) => {
          const isSelected = starter.key === previewStarterKey;
          const isPlaying = starter.key === playingStarterKey;

          return (
            <button
              key={starter.key}
              type="button"
              onClick={() => onPreviewStarter(starter)}
              className={`starter-card ${isSelected ? "starter-card-selected" : ""}`}
            >
              <div className="starter-sprite-box">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={starter.sprite} alt={starter.label} />
              </div>
              <p className="pixel-heading-sm mt-2">{starter.label}</p>
              <p className="pixel-text-sm mt-1 text-muted">
                {isPlaying ? "Playing cry..." : "Click to hear cry"}
              </p>
            </button>
          );
        })}
      </div>

      <button
        className="pokemon-btn pokemon-btn-red pokemon-btn-lg mt-6"
        onClick={onBeginSession}
      >
        Start with {previewStarterLabel}!
      </button>
    </div>
  );
}
