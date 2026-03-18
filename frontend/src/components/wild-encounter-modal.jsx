"use client";

import {
  Box,
  Button,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";

export function WildEncounterModal({
  wildPokemon,
  catchResult,
  partyFull,
  onAttemptCatch,
  onSetActive,
  onDismiss,
}) {
  if (!wildPokemon) return null;

  return (
    <Modal isOpen onClose={onDismiss} isCentered size="sm">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent borderRadius="xl" bg="study.paper" border="1px solid" borderColor="study.border">
        <ModalHeader textAlign="center" color="study.ink" pb={0}>
          {catchResult === "success"
            ? `Gotcha! ${wildPokemon.label} was caught!`
            : catchResult === "fail"
            ? `Oh no! ${wildPokemon.label} broke free!`
            : `A wild ${wildPokemon.label} appeared!`}
        </ModalHeader>

        <ModalBody>
          <VStack spacing={3} align="center">
            <Box
              bg="study.cream"
              borderRadius="xl"
              p={4}
              border="1px solid"
              borderColor="study.border"
              w="100%"
              textAlign="center"
            >
              <Image
                src={wildPokemon.sprite}
                alt={wildPokemon.label}
                mx="auto"
                w="96px"
                h="96px"
                style={{ imageRendering: "pixelated" }}
              />
              <Text fontWeight="bold" color="study.ink" mt={1}>
                {wildPokemon.label}
              </Text>
            </Box>

            {!catchResult && partyFull && (
              <Text fontSize="sm" color="study.inkMuted" textAlign="center">
                Your party is full (6/6). Release a Pokemon from your party to catch more.
              </Text>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter gap={2} justifyContent="center">
          {!catchResult && (
            <>
              <Button
                colorScheme="brand"
                onClick={onAttemptCatch}
                isDisabled={partyFull}
              >
                Throw Pokéball!
              </Button>
              <Button variant="ghost" onClick={onDismiss} color="study.inkMuted">
                Run
              </Button>
            </>
          )}

          {catchResult === "success" && (
            <>
              <Button colorScheme="brand" onClick={onSetActive}>
                Set as Active
              </Button>
              <Button variant="ghost" onClick={onDismiss} color="study.inkMuted">
                Keep Current
              </Button>
            </>
          )}

          {catchResult === "fail" && (
            <Button colorScheme="brand" onClick={onDismiss}>
              Continue Studying
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
