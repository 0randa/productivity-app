import { Badge, Box, Heading, Text } from "@chakra-ui/react";
import TimerComp from "@/components/timer";

export default function FocusPanel({
  statusMessage,
  onPomodoroStart,
  onPomodoroComplete,
}) {
  return (
    <Box
      p={7}
      borderRadius="2xl"
      bg="rgba(15, 23, 42, 0.65)"
      border="1px solid"
      borderColor="whiteAlpha.200"
    >
      <Badge colorScheme="orange" borderRadius="full" px={3} py={1}>
        Pomodoro RPG
      </Badge>
      <Heading mt={4} size="2xl" lineHeight="1.1">
        Build momentum one focused sprint at a time.
      </Heading>
      <Text mt={4} color="whiteAlpha.800" maxW="lg">
        Complete a pomodoro, then complete a task to claim XP for your companion.
      </Text>
      <Box mt={8}>
        <TimerComp
          onPomodoroStart={onPomodoroStart}
          onPomodoroComplete={onPomodoroComplete}
        />
      </Box>
      {statusMessage ? (
        <Text mt={4} fontSize="sm" color="orange.200">
          {statusMessage}
        </Text>
      ) : null}
    </Box>
  );
}
