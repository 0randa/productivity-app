"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
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
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (error) {
      setIsError(true);
      setMessage(error.message);
    } else {
      router.push("/");
    }
  };

  return (
    <Box minH="100vh" bg="study.cream" bgGradient="linear(to-b, #f5f3ef 0%, #faf9f7 50%, #ebe8e2 100%)">
      <NavbarComp />
      <Container maxW="md" py={10}>
        <Box
          p={8}
          borderRadius="card"
          bg="study.paper"
          border="1px solid"
          borderColor="study.border"
          boxShadow="card"
        >
          <Heading size="lg" color="study.ink">Welcome back</Heading>
          <Text color="study.inkMuted" mt={2} mb={6}>
            Continue your focus streak.
          </Text>

          <VStack as="form" spacing={4} align="stretch" onSubmit={handleSubmit}>
            <FormControl isRequired>
              <FormLabel color="study.ink">Email</FormLabel>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>

            <FormControl isRequired>
              <FormLabel color="study.ink">Password</FormLabel>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </FormControl>

            <Button type="submit" colorScheme="brand" size="lg" mt={2} isLoading={loading}>
              Login
            </Button>

            {message && (
              <Alert status={isError ? "error" : "success"} borderRadius="lg">
                <AlertIcon />
                {message}
              </Alert>
            )}
          </VStack>
        </Box>
      </Container>
    </Box>
  );
}
