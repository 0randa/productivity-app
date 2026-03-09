"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  Progress,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import TimerComp from "@/components/timer";
import Tasks from "@/components/tasks";
import { NavbarComp } from "@/components/navbar";

const STARTERS = [
  {
    key: "bulbasaur",
    label: "Bulbasaur",
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
    cry: "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/1.ogg",
  },
  {
    key: "charmander",
    label: "Charmander",
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png",
    cry: "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/4.ogg",
  },
  {
    key: "squirtle",
    label: "Squirtle",
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png",
    cry: "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/7.ogg",
  },
];

const INITIAL_TASKS = [];

const START_LEVEL = 5;
const XP_PER_LEVEL = 100;
const XP_PER_TASK = 40;
const createTaskId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

export default function App() {
  const [selectedStarter, setSelectedStarter] = useState(null);
  const [previewStarter, setPreviewStarter] = useState(STARTERS[0].key);
  const [playingStarter, setPlayingStarter] = useState("");
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [pomodorosStarted, setPomodorosStarted] = useState(0);
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0);
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [availableTaskClaims, setAvailableTaskClaims] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const audioRef = useRef(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const currentStarter = useMemo(
    () => STARTERS.find((starter) => starter.key === selectedStarter) ?? null,
    [selectedStarter]
  );

  const previewStarterData = useMemo(
    () => STARTERS.find((starter) => starter.key === previewStarter) ?? STARTERS[0],
    [previewStarter]
  );

  const level = START_LEVEL + Math.floor(totalXp / XP_PER_LEVEL);
  const xpInCurrentLevel = totalXp % XP_PER_LEVEL;
  const xpProgress = (xpInCurrentLevel / XP_PER_LEVEL) * 100;

  const playStarterCry = async (starterChoice) => {
    setPreviewStarter(starterChoice.key);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const cryAudio = new Audio(starterChoice.cry);
    cryAudio.volume = 0.75;
    audioRef.current = cryAudio;

    cryAudio.onended = () => {
      setPlayingStarter((current) => (current === starterChoice.key ? "" : current));
    };

    try {
      await cryAudio.play();
      setPlayingStarter(starterChoice.key);
    } catch (error) {
      setPlayingStarter("");
      console.error("Could not play starter cry:", error);
    }
  };

  const beginSession = () => {
    setSelectedStarter(previewStarter);
    setStatusMessage(
      `Welcome in. You chose ${previewStarterData.label} at level ${START_LEVEL}. Complete pomodoros and tasks to gain XP.`
    );
  };

  const handlePomodoroStart = () => {
    setPomodorosStarted((prev) => prev + 1);
  };

  const handlePomodoroComplete = () => {
    setPomodorosCompleted((prev) => prev + 1);
    setAvailableTaskClaims((prev) => prev + 1);
    setStatusMessage("Pomodoro complete. Mark one task done to claim XP.");
  };

  const handleTaskCreate = (taskName) => {
    const normalizedTaskName = taskName.trim();
    if (!normalizedTaskName) {
      setStatusMessage("Add a task name before creating it.");
      return false;
    }

    setTasks((prev) => [
      ...prev,
      {
        id: createTaskId(),
        name: normalizedTaskName,
        points: XP_PER_TASK,
        done: false,
      },
    ]);

    if (availableTaskClaims > 0) {
      setStatusMessage(`Task added: ${normalizedTaskName}. You can complete it now to claim XP.`);
    } else {
      setStatusMessage(`Task added: ${normalizedTaskName}. Complete a pomodoro to unlock completion.`);
    }

    return true;
  };

  const handleTaskComplete = (taskId) => {
    const taskToComplete = tasks.find((task) => task.id === taskId && !task.done);
    if (!taskToComplete) {
      return;
    }

    if (availableTaskClaims <= 0) {
      setStatusMessage("Complete a pomodoro first, then claim XP by finishing a task.");
      return;
    }

    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              done: true,
            }
          : task
      )
    );

    setAvailableTaskClaims((prev) => prev - 1);
    setTasksCompleted((prev) => prev + 1);
    setTotalXp((prev) => prev + XP_PER_TASK);
    setStatusMessage(`${taskToComplete.name} complete. ${currentStarter?.label ?? "Starter"} gained ${XP_PER_TASK} XP.`);
  };

  if (!selectedStarter) {
    return (
      <Box minH="100vh" bgGradient="linear(to-b, #0f172a, #172554 35%, #111827)">
        <NavbarComp />
        <Container maxW="6xl" py={{ base: 8, md: 12 }}>
          <Box
            p={{ base: 6, md: 8 }}
            borderRadius="2xl"
            bg="rgba(15, 23, 42, 0.72)"
            border="1px solid"
            borderColor="whiteAlpha.200"
          >
            <Badge colorScheme="orange" borderRadius="full" px={3} py={1}>
              First Session Setup
            </Badge>
            <Heading mt={4} size="xl">
              Choose your starter Pokémon
            </Heading>
            <Text color="whiteAlpha.800" mt={2} mb={6}>
              This choice is session-only for now. Refreshing the page will reset progress.
            </Text>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              {STARTERS.map((starter) => {
                const isSelected = starter.key === previewStarter;
                const isPlaying = starter.key === playingStarter;

                return (
                  <Box
                    key={starter.key}
                    as="button"
                    type="button"
                    onClick={() => playStarterCry(starter)}
                    textAlign="left"
                    borderRadius="xl"
                    p={4}
                    border="1px solid"
                    borderColor={isSelected ? "orange.300" : "whiteAlpha.300"}
                    bg={isSelected ? "orange.400" : "rgba(30, 41, 59, 0.7)"}
                    color={isSelected ? "gray.900" : "white"}
                    transition="all 0.2s ease"
                    transform={isSelected ? "translateY(-3px)" : "none"}
                    boxShadow={isSelected ? "0 12px 28px rgba(251, 146, 60, 0.35)" : "none"}
                    _hover={{ transform: "translateY(-3px)" }}
                  >
                    <VStack align="start" spacing={2}>
                      <Box
                        w="full"
                        h="100px"
                        borderRadius="lg"
                        bg={isSelected ? "orange.300" : "whiteAlpha.200"}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Image src={starter.sprite} alt={starter.label} maxH="92px" objectFit="contain" />
                      </Box>
                      <Text fontWeight="bold">{starter.label}</Text>
                      <Text fontSize="xs" opacity={0.85}>
                        {isPlaying ? "Playing cry..." : "Click to hear cry"}
                      </Text>
                    </VStack>
                  </Box>
                );
              })}
            </SimpleGrid>

            <Button mt={6} colorScheme="orange" size="lg" onClick={beginSession}>
              Start with {previewStarterData.label}
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bgGradient="linear(to-b, #0f172a, #172554 35%, #111827)">
      <NavbarComp />
      <Container maxW="6xl" py={{ base: 8, md: 12 }}>
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={6}>
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
              Complete a pomodoro, then complete a task to claim XP for your starter.
            </Text>
            <Box mt={8}>
              <TimerComp onPomodoroStart={handlePomodoroStart} onPomodoroComplete={handlePomodoroComplete} />
            </Box>
            {statusMessage ? (
              <Text mt={4} fontSize="sm" color="orange.200">
                {statusMessage}
              </Text>
            ) : null}
          </Box>

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
                <Image src={currentStarter.sprite} alt={currentStarter.label} w="full" h="full" objectFit="contain" />
              </Box>
              <Box>
                <Heading size="lg">{currentStarter.label}</Heading>
                <Text color="whiteAlpha.800">Level {level} Focus Companion</Text>
              </Box>
            </Flex>

            <Box mt={8}>
              <Text fontWeight="semibold">Experience</Text>
              <Text color="whiteAlpha.700" fontSize="sm" mb={2}>
                {xpInCurrentLevel} / {XP_PER_LEVEL} XP to next level
              </Text>
              <Progress value={xpProgress} colorScheme="green" borderRadius="full" bg="whiteAlpha.300" />
            </Box>

            <SimpleGrid columns={3} spacing={3} mt={8}>
              <StatCard label="XP / Task" value={XP_PER_TASK} />
              <StatCard label="Pomodoro Claims" value={availableTaskClaims} />
              <StatCard label="Total XP" value={totalXp} />
            </SimpleGrid>
          </Box>
        </SimpleGrid>

        <Tasks
          tasks={tasks}
          onAddTask={handleTaskCreate}
          onCompleteTask={handleTaskComplete}
          canCompleteTask={availableTaskClaims > 0}
          stats={{
            sessionsStarted: pomodorosStarted,
            sessionsCompleted: pomodorosCompleted,
            tasksCompleted,
            currentLevel: level,
          }}
        />
      </Container>
    </Box>
  );
}

function StatCard({ label, value }) {
  return (
    <Box
      p={3}
      borderRadius="lg"
      bg="rgba(15, 23, 42, 0.7)"
      border="1px solid"
      borderColor="whiteAlpha.200"
    >
      <Text fontSize="xs" textTransform="uppercase" letterSpacing="wide" color="whiteAlpha.700">
        {label}
      </Text>
      <Text mt={1} fontWeight="bold" fontSize="lg">
        {value}
      </Text>
    </Box>
  );
}
