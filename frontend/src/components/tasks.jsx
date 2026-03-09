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
        borderRadius="2xl"
        bg="rgba(30, 41, 59, 0.72)"
        border="1px solid"
        borderColor="whiteAlpha.200"
      >
        <Heading size="md" mb={2}>
          Active Tasks
        </Heading>
        <Text fontSize="sm" color="whiteAlpha.700" mb={4}>
          Finish one pomodoro, then complete one task to claim XP.
        </Text>

        <Box as="form" onSubmit={handleAddTask} mb={4}>
          <HStack spacing={3}>
            <Input
              value={taskDraft}
              onChange={(event) => setTaskDraft(event.target.value)}
              placeholder="Add a new task"
              bg="rgba(15, 23, 42, 0.75)"
              borderColor="whiteAlpha.300"
              _placeholder={{ color: "whiteAlpha.500" }}
            />
            <Button type="submit" colorScheme="orange">
              Add Task
            </Button>
          </HStack>
        </Box>

        {tasks.length === 0 ? (
          <Box
            p={5}
            borderRadius="lg"
            bg="rgba(15, 23, 42, 0.7)"
            border="1px solid"
            borderColor="whiteAlpha.200"
          >
            <Text fontWeight="semibold">No active tasks yet.</Text>
            <Text fontSize="sm" color="whiteAlpha.700" mt={1}>
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
              bg="rgba(15, 23, 42, 0.7)"
              border="1px solid"
              borderColor="whiteAlpha.200"
            >
              <HStack justify="space-between" align="center" spacing={4}>
                <VStack spacing={1} align="start">
                  <Text fontWeight="semibold">{task.name}</Text>
                  <Text fontSize="sm" color="whiteAlpha.700">
                    +{task.points} XP when complete
                  </Text>
                </VStack>

                <HStack spacing={2}>
                  <Badge
                    colorScheme={task.done ? "green" : "blue"}
                    borderRadius="full"
                    px={2.5}
                    py={1}
                  >
                    {task.done ? "Completed" : "Queued"}
                  </Badge>
                  <Button
                    size="sm"
                    colorScheme="orange"
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
        borderRadius="2xl"
        bg="rgba(30, 41, 59, 0.72)"
        border="1px solid"
        borderColor="whiteAlpha.200"
      >
        <Heading size="md" mb={4}>
          Session Stats
        </Heading>
        <VStack align="stretch" spacing={3}>
          <Stat p={3} borderRadius="lg" bg="rgba(15, 23, 42, 0.7)" border="1px solid" borderColor="whiteAlpha.200">
            <StatLabel color="whiteAlpha.700">Pomodoros Started</StatLabel>
            <StatNumber>{stats.sessionsStarted}</StatNumber>
          </Stat>
          <Stat p={3} borderRadius="lg" bg="rgba(15, 23, 42, 0.7)" border="1px solid" borderColor="whiteAlpha.200">
            <StatLabel color="whiteAlpha.700">Pomodoros Completed</StatLabel>
            <StatNumber>{stats.sessionsCompleted}</StatNumber>
          </Stat>
          <Stat p={3} borderRadius="lg" bg="rgba(15, 23, 42, 0.7)" border="1px solid" borderColor="whiteAlpha.200">
            <StatLabel color="whiteAlpha.700">Tasks Completed</StatLabel>
            <StatNumber>{stats.tasksCompleted}</StatNumber>
          </Stat>
          <Stat p={3} borderRadius="lg" bg="rgba(15, 23, 42, 0.7)" border="1px solid" borderColor="whiteAlpha.200">
            <StatLabel color="whiteAlpha.700">Current Level</StatLabel>
            <StatNumber>{stats.currentLevel}</StatNumber>
          </Stat>
        </VStack>
      </Box>
    </Flex>
  );
}
