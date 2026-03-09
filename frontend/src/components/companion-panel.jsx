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
      borderRadius="card"
      bg="rgba(250, 249, 247, 0.85)"
      border="1px solid"
      borderColor="study.border"
      boxShadow="cardHover"
      backdropFilter="blur(4px)"
    >
      <Flex align="center" gap={4}>
        <Box
          w="92px"
          h="92px"
          borderRadius="xl"
          bg="linear-gradient(160deg, #ffffff 0%, #f3f7f4 100%)"
          border="1px solid"
          borderColor="study.border"
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
          <Heading size="lg" color="study.ink">{activePokemon.label}</Heading>
          <Text color="study.inkMuted">Level {level} Focus Companion</Text>
          <Text mt={1} fontSize="sm" color="study.inkMuted">
            Every completed quest helps your companion grow.
          </Text>
        </Box>
      </Flex>

      <Box mt={8}>
        <Text fontWeight="semibold" color="study.ink">Experience</Text>
        <Text color="study.inkMuted" fontSize="sm" mb={2}>
          {level >= maxLevel
            ? "Max level reached"
            : `${xpInCurrentLevel} / ${xpNeededForNextLevel} XP toward level ${nextLevel}`}
        </Text>
        <Progress
          value={xpProgress}
          colorScheme="brand"
          borderRadius="full"
          bg="study.border"
        />
        {isGrowthDataLoading ? (
          <Text mt={2} fontSize="xs" color="study.inkMuted">
            Loading growth data from PokeAPI...
          </Text>
        ) : null}
        {growthDataError ? (
          <Text mt={2} fontSize="xs" color="red.500">
            {growthDataError}
          </Text>
        ) : null}
      </Box>

      {nextEvolution ? (
        <Box mt={5} p={3.5} borderRadius="lg" bg="whiteAlpha.750" border="1px solid" borderColor="study.border">
          <Text fontSize="sm" color="study.inkMuted">
            Next evolution: {nextEvolution.label}
            {typeof nextEvolution.minLevel === "number"
              ? ` at level ${nextEvolution.minLevel}`
              : " (special condition)"}
          </Text>
          <Button
            mt={3}
            size="sm"
            colorScheme="brand"
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
      bg="linear-gradient(165deg, #ffffff 0%, #f6f8f5 100%)"
      border="1px solid"
      borderColor="study.border"
    >
      <Text
        fontSize="xs"
        textTransform="uppercase"
        letterSpacing="wide"
        color="study.inkMuted"
      >
        {label}
      </Text>
      <Text mt={1} fontWeight="bold" fontSize="lg" color="study.ink">
        {value}
      </Text>
    </Box>
  );
}
