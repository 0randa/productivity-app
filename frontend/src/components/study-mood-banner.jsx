import { Badge, Box, Heading, HStack, Text } from "@chakra-ui/react";

export default function StudyMoodBanner({
  greetingLabel,
  activePokemonLabel,
  currentLevel,
  openTasks,
  availableTaskClaims,
}) {
  return (
    <Box
      p={{ base: 5, md: 7 }}
      borderRadius="card"
      bgGradient="linear(to-r, rgba(255,255,255,0.92), rgba(240,248,243,0.9))"
      border="1px solid"
      borderColor="whiteAlpha.800"
      boxShadow="cardHover"
      backdropFilter="blur(6px)"
    >
      <Badge colorScheme="brand" px={3} py={1}>
        {greetingLabel}
      </Badge>
      <Heading mt={3} size="lg" color="study.ink">
        Your focus ritual starts now.
      </Heading>
      <Text mt={2} color="study.inkMuted" maxW="2xl">
        Guide {activePokemonLabel} through training by finishing focused sprints and clearing quests.
        Every session should feel like progress, not pressure.
      </Text>

      <HStack mt={5} spacing={3} flexWrap="wrap">
        <Chip label={`Level ${currentLevel}`} />
        <Chip label={`${openTasks} Open Quests`} />
        <Chip label={`${availableTaskClaims} Claim Tickets`} />
      </HStack>
    </Box>
  );
}

function Chip({ label }) {
  return (
    <Box
      px={3}
      py={1.5}
      borderRadius="full"
      bg="rgba(255,255,255,0.88)"
      border="1px solid"
      borderColor="study.border"
    >
      <Text fontSize="sm" color="study.ink" fontWeight="semibold">
        {label}
      </Text>
    </Box>
  );
}
