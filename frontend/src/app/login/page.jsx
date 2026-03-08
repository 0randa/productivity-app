"use client";

import { useState } from "react";
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
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { NavbarComp } from "@/components/navbar";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/login", {
        email,
        password,
      });

      setIsError(false);
      setMessage(response.data.msg ?? "Logged in successfully.");
      setEmail("");
      setPassword("");
    } catch (error) {
      setIsError(true);
      setMessage(error?.response?.data?.msg ?? "Login failed.");
    }
  };

  return (
    <Box minH="100vh" bgGradient="linear(to-b, #0f172a, #172554 35%, #111827)">
      <NavbarComp />
      <Container maxW="md" py={10}>
        <Box
          p={8}
          borderRadius="2xl"
          bg="rgba(15, 23, 42, 0.72)"
          border="1px solid"
          borderColor="whiteAlpha.200"
        >
          <Heading size="lg">Welcome back</Heading>
          <Text color="whiteAlpha.700" mt={2} mb={6}>
            Continue your focus streak.
          </Text>

          <VStack as="form" spacing={4} align="stretch" onSubmit={handleSubmit}>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </FormControl>

            <Button type="submit" colorScheme="orange" size="lg" mt={2}>
              Login
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
