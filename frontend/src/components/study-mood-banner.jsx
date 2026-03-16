export default function StudyMoodBanner({
  greetingLabel,
  activePokemonLabel,
  currentLevel,
  openTasks,
  availableTaskClaims,
}) {
  return (
    <div className="pokemon-window mb-6">
      <span className="pokemon-badge pokemon-badge-red">{greetingLabel}</span>
      <h2 className="pixel-heading-lg mt-4">Your training begins!</h2>
      <p className="pixel-text mt-3 text-muted">
        Guide {activePokemonLabel} through training by finishing focused sprints
        and clearing quests. Every session brings you closer to champion status.
      </p>
      <div className="flex flex-wrap gap-2 mt-4">
        <span className="pokemon-chip">Lv.{currentLevel}</span>
        <span className="pokemon-chip">{openTasks} Quests</span>
        <span className="pokemon-chip">{availableTaskClaims} Claims</span>
      </div>
    </div>
  );
}
