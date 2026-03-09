import { Box, Container } from "@chakra-ui/react";
import { NavbarComp } from "@/components/navbar";

export default function StudyShell({ children }) {
  return (
    <Box
      className="study-shell"
      minH="100vh"
      bg="study.cream"
      bgGradient="linear(to-b, #f9f8f4 0%, #f2efe8 44%, #eef4ef 100%)"
    >
      <Box className="ambient-orb ambient-orb-one" />
      <Box className="ambient-orb ambient-orb-two" />
      <Box className="ambient-noise" />
      <NavbarComp />
      <Container maxW="6xl" py={{ base: 8, md: 12 }} position="relative" zIndex={1}>
        {children}
      </Container>
    </Box>
  );
}
