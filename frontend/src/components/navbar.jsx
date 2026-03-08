"use client";

import Link from "next/link";
import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Heading,
  Link as ChakraLink,
  Text,
} from "@chakra-ui/react";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/register", label: "Register" },
  { href: "/login", label: "Login" },
];

export function NavbarComp() {
  return (
    <Box
      as="header"
      position="sticky"
      top="0"
      zIndex="10"
      backdropFilter="blur(10px)"
      bg="rgba(15, 23, 42, 0.75)"
      borderBottom="1px solid"
      borderColor="whiteAlpha.200"
    >
      <Container maxW="6xl" py={3}>
        <Flex justify="space-between" align="center" gap={4}>
          <Flex align="center" gap={3}>
            <Box w="10px" h="10px" borderRadius="full" bg="orange.300" />
            <Heading size="md" letterSpacing="tight">
              PomoPet
            </Heading>
            <Text color="whiteAlpha.700" fontSize="sm" display={{ base: "none", md: "block" }}>
              Focus sessions with game-style progress
            </Text>
          </Flex>

          <HStack spacing={2}>
            {links.map((link) => (
              <ChakraLink as={Link} href={link.href} key={link.href} _hover={{ textDecoration: "none" }}>
                <Button variant="ghost" color="whiteAlpha.900" _hover={{ bg: "whiteAlpha.200" }}>
                  {link.label}
                </Button>
              </ChakraLink>
            ))}
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}
