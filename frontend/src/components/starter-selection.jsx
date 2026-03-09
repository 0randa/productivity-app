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
      borderRadius="card"
      bg="rgba(250, 249, 247, 0.88)"
      border="1px solid"
      borderColor="study.border"
      boxShadow="cardHover"
      backdropFilter="blur(4px)"
    >
      <Badge colorScheme="brand" borderRadius="full" px={3} py={1}>
        First Session Setup
      </Badge>
      <Heading mt={4} size="xl" color="study.ink">
        Choose your starter Pokémon
      </Heading>
      <Text color="study.inkMuted" mt={2} mb={6}>
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
              border="2px solid"
              borderColor={isSelected ? "brand.400" : "study.border"}
              bg={isSelected ? "brand.50" : "white"}
              color={isSelected ? "brand.800" : "study.ink"}
              transition="all 0.2s ease"
              transform={isSelected ? "translateY(-2px)" : "none"}
              boxShadow={isSelected ? "cardHover" : "soft"}
              _hover={{ transform: "translateY(-2px)", borderColor: "brand.300" }}
            >
              <VStack align="start" spacing={2}>
                <Box
                  w="full"
                  h="100px"
                  borderRadius="lg"
                  bg={isSelected ? "brand.100" : "study.border"}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Image src={starter.sprite} alt={starter.label} maxH="92px" objectFit="contain" />
                </Box>
                <Text fontWeight="bold">{starter.label}</Text>
                <Text fontSize="xs" color="study.inkMuted">
                  {isPlaying ? "Playing cry..." : "Click to hear cry"}
                </Text>
              </VStack>
            </Box>
          );
        })}
      </SimpleGrid>

      <Button mt={6} colorScheme="brand" size="lg" onClick={onBeginSession}>
        Start with {previewStarterLabel}
      </Button>
    </Box>
  );
}
