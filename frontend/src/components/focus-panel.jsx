import { Badge, Box, Heading, HStack, Text } from "@chakra-ui/react";
import TimerComp from "@/components/timer";

export default function FocusPanel({
  statusMessage,
  onPomodoroStart,
  onPomodoroComplete,
}) {
  return (
    <Box
      p={7}
      borderRadius="card"
      bg="rgba(250, 249, 247, 0.85)"
      border="1px solid"
      borderColor="study.border"
      boxShadow="cardHover"
      backdropFilter="blur(4px)"
    >
      <Badge colorScheme="brand" borderRadius="full" px={3} py={1}>
        Focus Ritual
      </Badge>
      <Heading mt={4} size="2xl" lineHeight="1.1" color="study.ink">
        Protect one calm block of attention.
      </Heading>
      <Text mt={4} color="study.inkMuted" maxW="lg">
        Start small, stay present, and let your streak pull you into deeper work.
      </Text>
      <HStack mt={4} spacing={2} flexWrap="wrap">
        <MiniTag label="Breathe In" />
        <MiniTag label="Single Task" />
        <MiniTag label="Finish Strong" />
      </HStack>
      <Box mt={8}>
        <TimerComp
          onPomodoroStart={onPomodoroStart}
          onPomodoroComplete={onPomodoroComplete}
        />
      </Box>
      {statusMessage ? (
        <Box mt={4} p={3} borderRadius="lg" bg="whiteAlpha.700" border="1px solid" borderColor="study.border">
          <Text fontSize="sm" color="brand.700">
            {statusMessage}
          </Text>
        </Box>
      ) : null}
    </Box>
  );
}

function MiniTag({ label }) {
  return (
    <Box
      px={2.5}
      py={1}
      borderRadius="full"
      bg="whiteAlpha.800"
      border="1px solid"
      borderColor="study.border"
    >
      <Text fontSize="xs" color="study.inkMuted" fontWeight="semibold">
        {label}
      </Text>
    </Box>
  );
}
