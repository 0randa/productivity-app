export default function CompanionPanel({
  activePokemon,
  level,
  xpInCurrentLevel,
  xpNeededForNextLevel,
  xpProgress,
  nextLevel,
  maxLevel,
  isGrowthDataLoading,
  growthDataError,
  nextEvolution,
  canEvolveByLevel,
  onEvolve,
  xpPerTask,
  availableTaskClaims,
  totalXp,
}) {
  return (
    <div className="pokemon-window">
      <div className="flex items-center gap-4">
        <div className="sprite-frame">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={activePokemon.sprite} alt={activePokemon.label} />
        </div>
        <div>
          <h3 className="pixel-heading">{activePokemon.label}</h3>
          <p className="pixel-text text-muted">Lv.{level} Partner</p>
          <p className="pixel-text-sm mt-1 text-muted">
            Every completed quest helps your Pokemon grow!
          </p>
        </div>
      </div>

      <div className="mt-6">
        <p className="pixel-heading-sm">EXP Points</p>
        <p className="pixel-text-sm mt-2 text-muted">
          {level >= maxLevel
            ? "MAX LEVEL!"
            : `${xpInCurrentLevel} / ${xpNeededForNextLevel} XP → Lv.${nextLevel}`}
        </p>
        <div className="pokemon-bar-container pokemon-bar-xp mt-2">
          <div className="pokemon-bar-fill" style={{ width: `${xpProgress}%` }} />
        </div>
        {isGrowthDataLoading && (
          <p className="pixel-text-sm mt-2 text-muted">Loading growth data...</p>
        )}
        {growthDataError && (
          <p className="pixel-text-sm mt-2" style={{ color: "var(--poke-red)" }}>
            {growthDataError}
          </p>
        )}
      </div>

      {nextEvolution && (
        <div className="evolution-box mt-4">
          <p className="pixel-text-sm">
            Next evolution: <strong>{nextEvolution.label}</strong>
            {typeof nextEvolution.minLevel === "number"
              ? ` at Lv.${nextEvolution.minLevel}`
              : " (special)"}
          </p>
          <button
            className="pokemon-btn pokemon-btn-blue mt-3"
            onClick={onEvolve}
            disabled={!canEvolveByLevel}
          >
            Evolve!
          </button>
        </div>
      )}

      <div className="grid-3 mt-6">
        <div className="pokemon-stat-card">
          <p className="pokemon-stat-label">XP / Task</p>
          <p className="pokemon-stat-value">{xpPerTask}</p>
        </div>
        <div className="pokemon-stat-card">
          <p className="pokemon-stat-label">Claims</p>
          <p className="pokemon-stat-value">{availableTaskClaims}</p>
        </div>
        <div className="pokemon-stat-card">
          <p className="pokemon-stat-label">Total XP</p>
          <p className="pokemon-stat-value">{totalXp}</p>
        </div>
      </div>
    </div>
  );
}
