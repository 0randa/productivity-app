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
      zIndex="20"
      backdropFilter="blur(14px)"
      bg="rgba(249, 248, 244, 0.82)"
      borderBottom="1px solid"
      borderColor="study.border"
    >
      <Container maxW="6xl" py={3}>
        <Flex justify="space-between" align="center" gap={4}>
          <Flex align="center" gap={3}>
            <Box
              w="10px"
              h="10px"
              borderRadius="full"
              bg="brand.400"
              boxShadow="0 0 0 6px rgba(107, 155, 138, 0.2)"
            />
            <Heading size="md" letterSpacing="tight" color="study.ink">
              PomoPet
            </Heading>
            <Text color="study.inkMuted" fontSize="sm" display={{ base: "none", md: "block" }}>
              Turn study time into your daily training arc
            </Text>
          </Flex>

          <HStack spacing={2}>
            {links.map((link) => (
              <ChakraLink as={Link} href={link.href} key={link.href} _hover={{ textDecoration: "none" }}>
                <Button
                  variant="ghost"
                  color="study.ink"
                  _hover={{ bg: "whiteAlpha.800", color: "study.ink" }}
                >
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
