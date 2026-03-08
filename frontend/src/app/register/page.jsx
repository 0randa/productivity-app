"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
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

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [starter, setStarter] = useState("bulbasaur");
  const [playingStarter, setPlayingStarter] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playStarterCry = async (starterChoice) => {
    setStarter(starterChoice.key);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const cryAudio = new Audio(starterChoice.cry);
    cryAudio.volume = 0.7;
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setIsError(true);
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/register", {
        username,
        email,
        password,
        starter,
      });

      setIsError(false);
      setMessage(response.data.msg ?? "Registration successful.");
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setStarter("bulbasaur");
      setPlayingStarter("");
    } catch (error) {
      setIsError(true);
      setMessage(error?.response?.data?.msg ?? "Registration failed.");
    }
  };

  return (
    <Box minH="100vh" bgGradient="linear(to-b, #0f172a, #172554 35%, #111827)">
      <NavbarComp />
      <Container maxW="2xl" py={10}>
        <Box
          p={8}
          borderRadius="2xl"
          bg="rgba(15, 23, 42, 0.72)"
          border="1px solid"
          borderColor="whiteAlpha.200"
        >
          <Heading size="lg">Create your account</Heading>
          <Text color="whiteAlpha.700" mt={2} mb={6}>
            Join PomoPet to track focused sessions and task progress.
          </Text>

          <VStack as="form" spacing={4} align="stretch" onSubmit={handleSubmit}>
            <FormControl isRequired>
              <FormLabel>Username</FormLabel>
              <Input value={username} onChange={(e) => setUsername(e.target.value)} />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Confirm Password</FormLabel>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Choose your starter</FormLabel>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3}>
                {STARTERS.map((starterChoice) => {
                  const isSelected = starter === starterChoice.key;
                  const isPlaying = playingStarter === starterChoice.key;

                  return (
                    <Box
                      key={starterChoice.key}
                      as="button"
                      type="button"
                      textAlign="left"
                      border="1px solid"
                      borderColor={isSelected ? "orange.300" : "whiteAlpha.300"}
                      borderRadius="xl"
                      bg={isSelected ? "orange.400" : "whiteAlpha.100"}
                      color={isSelected ? "gray.900" : "white"}
                      p={3}
                      transition="transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease"
                      transform={isSelected ? "translateY(-2px)" : "translateY(0)"}
                      boxShadow={isSelected ? "0 10px 24px rgba(251, 146, 60, 0.35)" : "none"}
                      _hover={{
                        transform: "translateY(-2px)",
                        boxShadow: "0 10px 24px rgba(148, 163, 184, 0.25)",
                      }}
                      onClick={() => playStarterCry(starterChoice)}
                    >
                      <VStack align="start" spacing={2}>
                        <Box
                          w="full"
                          h="92px"
                          borderRadius="lg"
                          bg={isSelected ? "orange.300" : "whiteAlpha.200"}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          overflow="hidden"
                        >
                          <Image
                            src={starterChoice.sprite}
                            alt={starterChoice.label}
                            maxH="86px"
                            objectFit="contain"
                          />
                        </Box>
                        <Text fontWeight="bold">{starterChoice.label}</Text>
                        <Text fontSize="xs" opacity={0.85}>
                          {isPlaying ? "Playing cry..." : "Click to hear cry"}
                        </Text>
                      </VStack>
                    </Box>
                  );
                })}
              </SimpleGrid>
            </FormControl>

            <Button type="submit" colorScheme="orange" size="lg" mt={2}>
              Register
            </Button>

            {message ? (
              <Alert status={isError ? "error" : "success"} borderRadius="lg">
                <AlertIcon />
                {message}
              </Alert>
            ) : null}
          </VStack>
        </Box>
      </Container>
    </Box>
  );
}
