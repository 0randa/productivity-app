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
import StudyShell from "@/components/study-shell";

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
    <StudyShell>
      <Container maxW="md" py={10}>
        <Box
          p={8}
          borderRadius="lg"
          bg="var(--window-bg)"
          border="1px solid"
          borderColor="var(--window-border)"
        >
          <Heading size="lg" color="var(--text-dark)">Welcome back</Heading>
          <Text color="var(--text-muted)" mt={2} mb={6}>
            Continue your focus streak.
          </Text>

          <VStack as="form" spacing={4} align="stretch" onSubmit={handleSubmit}>
            <FormControl isRequired>
              <FormLabel color="var(--text-dark)">Email</FormLabel>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>

            <FormControl isRequired>
              <FormLabel color="var(--text-dark)">Password</FormLabel>
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
    </StudyShell>
  );
}
