"use client";

import { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Container,
  Flex,
  Heading,
  Image,
  Progress,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import TimerComp from "@/components/timer";
import Tasks from "@/components/tasks";
import { NavbarComp } from "@/components/navbar";

export default function App() {
  const [image, setImage] = useState(null);
  const pokemon = "pikachu";
  const level = 14;
  const currentXp = 760;
  const nextLevelXp = 1000;

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
      .then((response) => response.json())
      .then((data) => setImage(data.sprites.other["official-artwork"].front_default))
      .catch((error) => console.error(error));
  }, []);

  const xpProgress = (currentXp / nextLevelXp) * 100;

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
              Start a 25-minute focus cycle, clear your task queue, and level your companion as you stay consistent.
            </Text>
            <Box mt={8}>
              <TimerComp />
            </Box>
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
                w="88px"
                h="88px"
                borderRadius="xl"
                bg="whiteAlpha.200"
                border="1px solid"
                borderColor="whiteAlpha.300"
                p={2}
              >
                {image ? <Image src={image} alt="Companion" w="full" h="full" objectFit="contain" /> : null}
              </Box>
              <Box>
                <Heading size="lg" textTransform="capitalize">
                  {pokemon}
                </Heading>
                <Text color="whiteAlpha.800">Level {level} Focus Companion</Text>
              </Box>
            </Flex>

            <Box mt={8}>
              <Text fontWeight="semibold">Experience</Text>
              <Text color="whiteAlpha.700" fontSize="sm" mb={2}>
                {currentXp} / {nextLevelXp} XP
              </Text>
              <Progress value={xpProgress} colorScheme="green" borderRadius="full" bg="whiteAlpha.300" />
            </Box>

            <SimpleGrid columns={3} spacing={3} mt={8}>
              <StatCard label="XP / Task" value="30" />
              <StatCard label="Daily Streak" value="6" />
              <StatCard label="Coins" value="250" />
            </SimpleGrid>
          </Box>
        </SimpleGrid>

        <Tasks />
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
