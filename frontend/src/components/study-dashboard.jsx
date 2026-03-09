import { Box, SimpleGrid } from "@chakra-ui/react";
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
  companionProps,
  taskBoardProps,
}) {
  return (
    <>
      <Box mb={6}>
        <StudyMoodBanner
          greetingLabel={greetingLabel}
          activePokemonLabel={activePokemon.label}
          currentLevel={level}
          openTasks={openTasks}
          availableTaskClaims={availableTaskClaims}
        />
      </Box>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={6}>
        <FocusPanel
          statusMessage={statusMessage}
          onPomodoroStart={onPomodoroStart}
          onPomodoroComplete={onPomodoroComplete}
        />
        <CompanionPanel {...companionProps} />
      </SimpleGrid>

      <Tasks {...taskBoardProps} />
    </>
  );
}
