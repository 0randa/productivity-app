import {
  Badge,
  Box,
  Button,
  Heading,
  Image,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";

export default function StarterSelection({
  starters,
  previewStarterKey,
  playingStarterKey,
  onPreviewStarter,
  onBeginSession,
  previewStarterLabel,
}) {
  return (
    <Box
      p={{ base: 6, md: 8 }}
      borderRadius="2xl"
      bg="rgba(15, 23, 42, 0.72)"
      border="1px solid"
      borderColor="whiteAlpha.200"
    >
      <Badge colorScheme="orange" borderRadius="full" px={3} py={1}>
        First Session Setup
      </Badge>
      <Heading mt={4} size="xl">
        Choose your starter Pokémon
      </Heading>
      <Text color="whiteAlpha.800" mt={2} mb={6}>
        This choice is session-only for now. Refreshing the page will reset progress.
      </Text>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
        {starters.map((starter) => {
          const isSelected = starter.key === previewStarterKey;
          const isPlaying = starter.key === playingStarterKey;

          return (
            <Box
              key={starter.key}
              as="button"
              type="button"
              onClick={() => onPreviewStarter(starter)}
              textAlign="left"
              borderRadius="xl"
              p={4}
              border="1px solid"
              borderColor={isSelected ? "orange.300" : "whiteAlpha.300"}
              bg={isSelected ? "orange.400" : "rgba(30, 41, 59, 0.7)"}
              color={isSelected ? "gray.900" : "white"}
              transition="all 0.2s ease"
              transform={isSelected ? "translateY(-3px)" : "none"}
              boxShadow={isSelected ? "0 12px 28px rgba(251, 146, 60, 0.35)" : "none"}
              _hover={{ transform: "translateY(-3px)" }}
            >
              <VStack align="start" spacing={2}>
                <Box
                  w="full"
                  h="100px"
                  borderRadius="lg"
                  bg={isSelected ? "orange.300" : "whiteAlpha.200"}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Image src={starter.sprite} alt={starter.label} maxH="92px" objectFit="contain" />
                </Box>
                <Text fontWeight="bold">{starter.label}</Text>
                <Text fontSize="xs" opacity={0.85}>
                  {isPlaying ? "Playing cry..." : "Click to hear cry"}
                </Text>
              </VStack>
            </Box>
          );
        })}
      </SimpleGrid>

      <Button mt={6} colorScheme="orange" size="lg" onClick={onBeginSession}>
        Start with {previewStarterLabel}
      </Button>
    </Box>
  );
}
