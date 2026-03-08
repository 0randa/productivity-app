"use client";

import {
  Badge,
  Box,
  Flex,
  Heading,
  HStack,
  List,
  ListItem,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  VStack,
} from "@chakra-ui/react";

const taskItems = [
  { name: "Finish lecture notes", status: "In Progress", points: 30 },
  { name: "Preview tutorial exercises", status: "Queued", points: 15 },
  { name: "Complete coding lab", status: "Queued", points: 40 },
  { name: "Ship assignment draft", status: "In Progress", points: 60 },
];

const stats = [
  { label: "Sessions Started", value: 12 },
  { label: "Sessions Completed", value: 9 },
  { label: "Tasks Finished", value: 7 },
  { label: "Resets", value: 3 },
];

export default function Tasks() {
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
        <Heading size="md" mb={4}>
          Active Tasks
        </Heading>
        <List spacing={3}>
          {taskItems.map((task) => (
            <ListItem
              key={task.name}
              p={3}
              borderRadius="lg"
              bg="rgba(15, 23, 42, 0.7)"
              border="1px solid"
              borderColor="whiteAlpha.200"
            >
              <HStack justify="space-between" align="start">
                <VStack spacing={1} align="start">
                  <Text fontWeight="semibold">{task.name}</Text>
                  <Text fontSize="sm" color="whiteAlpha.700">
                    +{task.points} XP when complete
                  </Text>
                </VStack>
                <Badge
                  colorScheme={task.status === "In Progress" ? "orange" : "blue"}
                  borderRadius="full"
                  px={2.5}
                  py={1}
                >
                  {task.status}
                </Badge>
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
          Player Stats
        </Heading>
        <VStack align="stretch" spacing={3}>
          {stats.map((item) => (
            <Stat
              key={item.label}
              p={3}
              borderRadius="lg"
              bg="rgba(15, 23, 42, 0.7)"
              border="1px solid"
              borderColor="whiteAlpha.200"
            >
              <StatLabel color="whiteAlpha.700">{item.label}</StatLabel>
              <StatNumber>{item.value}</StatNumber>
            </Stat>
          ))}
        </VStack>
      </Box>
    </Flex>
  );
}
