"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Button, HStack, Progress, Text, VStack } from "@chakra-ui/react";

const START_MINUTES = 25;
const START_SECONDS_TOTAL = START_MINUTES * 60;

export default function TimerComp() {
  const [secondsLeft, setSecondsLeft] = useState(START_SECONDS_TOTAL);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) {
      return undefined;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const progress = useMemo(() => {
    const elapsed = START_SECONDS_TOTAL - secondsLeft;
    return (elapsed / START_SECONDS_TOTAL) * 100;
  }, [secondsLeft]);

  return (
    <VStack spacing={6} align="stretch">
      <Box
        px={6}
        py={8}
        borderRadius="2xl"
        bg="rgba(15, 23, 42, 0.65)"
        border="1px solid"
        borderColor="whiteAlpha.200"
        boxShadow="0 12px 34px rgba(15, 23, 42, 0.45)"
      >
        <Text fontSize="sm" textTransform="uppercase" letterSpacing="wide" color="whiteAlpha.700">
          Focus Session
        </Text>
        <Text fontSize={{ base: "5xl", md: "6xl" }} fontWeight="bold" lineHeight="1" mt={2}>
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </Text>
        <Progress
          value={progress}
          mt={5}
          colorScheme="orange"
          borderRadius="full"
          bg="whiteAlpha.200"
          sx={{
            ".chakra-progress__filled-track": {
              transition: "width 0.6s ease",
            },
          }}
        />
        <HStack spacing={3} mt={6}>
          <Button
            colorScheme="orange"
            onClick={() => setIsRunning((prev) => !prev)}
            minW="140px"
          >
            {isRunning ? "Pause" : "Start"}
          </Button>
          <Button
            variant="outline"
            color="whiteAlpha.900"
            borderColor="whiteAlpha.400"
            _hover={{ bg: "whiteAlpha.200" }}
            onClick={() => {
              setIsRunning(false);
              setSecondsLeft(START_SECONDS_TOTAL);
            }}
          >
            Reset
          </Button>
        </HStack>
      </Box>
    </VStack>
  );
}
