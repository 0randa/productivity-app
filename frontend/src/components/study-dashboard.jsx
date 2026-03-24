import CompanionPanel from "@/components/companion-panel";
import FocusPanel from "@/components/focus-panel";
import StudyMoodBanner from "@/components/study-mood-banner";
import Tasks from "@/components/tasks";

export default function StudyDashboard({
  greetingLabel,
  activePokemon,
  level,
  openTasks,
  availableTaskClaims,
  statusMessage,
  onPomodoroStart,
  onPomodoroComplete,
  onFlowComplete,
  companionProps,
  taskBoardProps,
}) {
  return (
    <>
      <StudyMoodBanner
        greetingLabel={greetingLabel}
        activePokemonLabel={activePokemon.label}
        currentLevel={level}
        openTasks={openTasks}
        availableTaskClaims={availableTaskClaims}
      />

      <div className="grid-2 mb-6">
        <FocusPanel
          statusMessage={statusMessage}
          onPomodoroStart={onPomodoroStart}
          onPomodoroComplete={onPomodoroComplete}
          onFlowComplete={onFlowComplete}
        />
        <CompanionPanel {...companionProps} />
      </div>

      <Tasks {...taskBoardProps} />
    </>
  );
}
