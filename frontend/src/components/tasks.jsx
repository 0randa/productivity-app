"use client";

import { useState } from "react";
import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Input,
  List,
  ListItem,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  VStack,
} from "@chakra-ui/react";

export default function Tasks({ tasks, onAddTask, onCompleteTask, canCompleteTask, stats }) {
  const [taskDraft, setTaskDraft] = useState("");

  const handleAddTask = (event) => {
    event.preventDefault();
    const wasCreated = onAddTask?.(taskDraft);
    if (wasCreated) {
      setTaskDraft("");
    }
  };

  return (
    <Flex direction={{ base: "column", lg: "row" }} gap={6}>
      <Box
        flex="2"
        p={6}
        borderRadius="card"
        bg="rgba(250, 249, 247, 0.85)"
        border="1px solid"
        borderColor="study.border"
        boxShadow="cardHover"
        backdropFilter="blur(4px)"
      >
        <Heading size="md" mb={2} color="study.ink">
          Quest Board
        </Heading>
        <Text fontSize="sm" color="study.inkMuted" mb={4}>
          Capture your study targets, then convert each focus sprint into real momentum.
        </Text>

        <Box as="form" onSubmit={handleAddTask} mb={4}>
          <HStack spacing={3}>
            <Input
              value={taskDraft}
              onChange={(event) => setTaskDraft(event.target.value)}
              placeholder="What do you want to finish next?"
            />
            <Button type="submit" colorScheme="brand">
              Add Task
            </Button>
          </HStack>
        </Box>

        {tasks.length === 0 ? (
          <Box
            p={5}
            borderRadius="lg"
            bg="linear-gradient(165deg, #ffffff 0%, #f6f8f5 100%)"
            border="1px solid"
            borderColor="study.border"
          >
            <Text fontWeight="semibold" color="study.ink">No active tasks yet.</Text>
            <Text fontSize="sm" color="study.inkMuted" mt={1}>
              Add your first task above, then complete a pomodoro to unlock task completion.
            </Text>
          </Box>
        ) : null}

        <List spacing={3}>
          {tasks.map((task) => (
            <ListItem
              key={task.id}
              p={3}
              borderRadius="lg"
              bg="linear-gradient(165deg, #ffffff 0%, #f6f8f5 100%)"
              border="1px solid"
              borderColor="study.border"
              transition="all 0.18s ease"
              _hover={{ transform: "translateY(-1px)", boxShadow: "soft" }}
            >
              <HStack justify="space-between" align="center" spacing={4}>
                <VStack spacing={1} align="start">
                  <Text fontWeight="semibold" color="study.ink">{task.name}</Text>
                  <Text fontSize="sm" color="study.inkMuted">
                    +{task.points} XP when complete
                  </Text>
                </VStack>

                <HStack spacing={2}>
                  <Badge
                    colorScheme={task.done ? "green" : "brand"}
                    borderRadius="full"
                    px={2.5}
                    py={1}
                  >
                    {task.done ? "Completed" : "Queued"}
                  </Badge>
                  <Button
                    size="sm"
                    colorScheme="brand"
                    variant={task.done ? "outline" : "solid"}
                    onClick={() => onCompleteTask(task.id)}
                    isDisabled={task.done || !canCompleteTask}
                  >
                    {task.done ? "Done" : "Complete"}
                  </Button>
                </HStack>
              </HStack>
            </ListItem>
          ))}
        </List>
      </Box>

      <Box
        flex="1"
        p={6}
        borderRadius="card"
        bg="rgba(250, 249, 247, 0.85)"
        border="1px solid"
        borderColor="study.border"
        boxShadow="cardHover"
        backdropFilter="blur(4px)"
      >
        <Heading size="md" mb={4} color="study.ink">
          Momentum Stats
        </Heading>
        <VStack align="stretch" spacing={3}>
          <Stat p={3} borderRadius="lg" bg="linear-gradient(165deg, #ffffff 0%, #f6f8f5 100%)" border="1px solid" borderColor="study.border">
            <StatLabel color="study.inkMuted">Pomodoros Started</StatLabel>
            <StatNumber color="study.ink">{stats.sessionsStarted}</StatNumber>
          </Stat>
          <Stat p={3} borderRadius="lg" bg="linear-gradient(165deg, #ffffff 0%, #f6f8f5 100%)" border="1px solid" borderColor="study.border">
            <StatLabel color="study.inkMuted">Pomodoros Completed</StatLabel>
            <StatNumber color="study.ink">{stats.sessionsCompleted}</StatNumber>
          </Stat>
          <Stat p={3} borderRadius="lg" bg="linear-gradient(165deg, #ffffff 0%, #f6f8f5 100%)" border="1px solid" borderColor="study.border">
            <StatLabel color="study.inkMuted">Tasks Completed</StatLabel>
            <StatNumber color="study.ink">{stats.tasksCompleted}</StatNumber>
          </Stat>
          <Stat p={3} borderRadius="lg" bg="linear-gradient(165deg, #ffffff 0%, #f6f8f5 100%)" border="1px solid" borderColor="study.border">
            <StatLabel color="study.inkMuted">Current Level</StatLabel>
            <StatNumber color="study.ink">{stats.currentLevel}</StatNumber>
          </Stat>
        </VStack>
      </Box>
    </Flex>
  );
}
