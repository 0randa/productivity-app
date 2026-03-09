import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Progress,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";

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
    <Box
      p={7}
      borderRadius="2xl"
      bg="rgba(30, 41, 59, 0.72)"
      border="1px solid"
      borderColor="whiteAlpha.200"
    >
      <Flex align="center" gap={4}>
        <Box
          w="92px"
          h="92px"
          borderRadius="xl"
          bg="whiteAlpha.200"
          border="1px solid"
          borderColor="whiteAlpha.300"
          p={2}
        >
          <Image
            src={activePokemon.sprite}
            alt={activePokemon.label}
            w="full"
            h="full"
            objectFit="contain"
          />
        </Box>
        <Box>
          <Heading size="lg">{activePokemon.label}</Heading>
          <Text color="whiteAlpha.800">Level {level} Focus Companion</Text>
        </Box>
      </Flex>

      <Box mt={8}>
        <Text fontWeight="semibold">Experience</Text>
        <Text color="whiteAlpha.700" fontSize="sm" mb={2}>
          {level >= maxLevel
            ? "Max level reached"
            : `${xpInCurrentLevel} / ${xpNeededForNextLevel} XP toward level ${nextLevel}`}
        </Text>
        <Progress
          value={xpProgress}
          colorScheme="green"
          borderRadius="full"
          bg="whiteAlpha.300"
        />
        {isGrowthDataLoading ? (
          <Text mt={2} fontSize="xs" color="whiteAlpha.700">
            Loading growth data from PokeAPI...
          </Text>
        ) : null}
        {growthDataError ? (
          <Text mt={2} fontSize="xs" color="yellow.200">
            {growthDataError}
          </Text>
        ) : null}
      </Box>

      {nextEvolution ? (
        <Box mt={5}>
          <Text fontSize="sm" color="whiteAlpha.800">
            Next evolution: {nextEvolution.label}
            {typeof nextEvolution.minLevel === "number"
              ? ` at level ${nextEvolution.minLevel}`
              : " (special condition)"}
          </Text>
          <Button
            mt={3}
            size="sm"
            colorScheme="orange"
            onClick={onEvolve}
            isDisabled={!canEvolveByLevel}
          >
            Evolve
          </Button>
        </Box>
      ) : null}

      <SimpleGrid columns={3} spacing={3} mt={8}>
        <CompanionStatCard label="XP / Task" value={xpPerTask} />
        <CompanionStatCard label="Pomodoro Claims" value={availableTaskClaims} />
        <CompanionStatCard label="Earned XP" value={totalXp} />
      </SimpleGrid>
    </Box>
  );
}

function CompanionStatCard({ label, value }) {
  return (
    <Box
      p={3}
      borderRadius="lg"
      bg="rgba(15, 23, 42, 0.7)"
      border="1px solid"
      borderColor="whiteAlpha.200"
    >
      <Text
        fontSize="xs"
        textTransform="uppercase"
        letterSpacing="wide"
        color="whiteAlpha.700"
      >
        {label}
      </Text>
      <Text mt={1} fontWeight="bold" fontSize="lg">
        {value}
      </Text>
    </Box>
  );
}
