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

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setIsError(true);
      setMessage("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setIsError(true);
      setMessage("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setLoading(false);
      setIsError(true);
      setMessage(error.message);
      return;
    }

    if (data.session) {
      // signUp returned a session directly — already logged in, go to app
      router.push("/");
      return;
    }

    // No session yet — attempt immediate sign-in.
    // This works when email confirmation is disabled in Supabase.
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (!signInError) {
      router.push("/");
    } else {
      // Email confirmation is required — ask the user to check their inbox
      setIsError(false);
      setMessage("Account created! Check your email to confirm your account before logging in.");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
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
          <Heading size="lg" color="study.ink">Create your account</Heading>
          <Text color="study.inkMuted" mt={2} mb={6}>
            Join PomoPet to track focused sessions and task progress.
          </Text>

          <VStack as="form" spacing={4} align="stretch" onSubmit={handleSubmit}>
            <FormControl isRequired>
              <FormLabel color="study.ink">Email</FormLabel>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>

            <FormControl isRequired>
              <FormLabel color="study.ink">Password (min 6 characters)</FormLabel>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </FormControl>

            <FormControl isRequired>
              <FormLabel color="study.ink">Confirm Password</FormLabel>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </FormControl>

            <Button type="submit" colorScheme="brand" size="lg" mt={2} isLoading={loading}>
              Create Account
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
