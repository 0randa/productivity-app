"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Button, HStack, Progress, Text, VStack } from "@chakra-ui/react";

const FOCUS_SECONDS_TOTAL = 10;
const BREAK_SECONDS_TOTAL = 2;

export default function TimerComp({ onPomodoroStart, onPomodoroComplete }) {
  const [mode, setMode] = useState("focus");
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_SECONDS_TOTAL);
  const [isRunning, setIsRunning] = useState(false);
  const [canStartBreak, setCanStartBreak] = useState(false);

  useEffect(() => {
    if (!isRunning) {
      return undefined;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          if (mode === "focus") {
            setCanStartBreak(true);
            if (onPomodoroComplete) {
              onPomodoroComplete();
            }
            return 0;
          }

          setMode("focus");
          setCanStartBreak(false);
          return FOCUS_SECONDS_TOTAL;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, mode, onPomodoroComplete]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const totalForMode = mode === "focus" ? FOCUS_SECONDS_TOTAL : BREAK_SECONDS_TOTAL;
  const progress = useMemo(() => {
    const elapsed = totalForMode - secondsLeft;
    return (elapsed / totalForMode) * 100;
  }, [secondsLeft, totalForMode]);

  const toggleTimer = () => {
    if (isRunning) {
      setIsRunning(false);
      return;
    }

    if (mode === "focus" && canStartBreak) {
      setMode("break");
      setSecondsLeft(BREAK_SECONDS_TOTAL);
      setCanStartBreak(false);
      setIsRunning(true);
      return;
    }

    if (mode === "focus" && (secondsLeft === FOCUS_SECONDS_TOTAL || secondsLeft === 0)) {
      if (onPomodoroStart) {
        onPomodoroStart();
      }
    }

    setIsRunning(true);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setMode("focus");
    setCanStartBreak(false);
    setSecondsLeft(FOCUS_SECONDS_TOTAL);
  };

  const primaryLabel = () => {
    if (isRunning) {
      return mode === "focus" ? "Pause" : "Pause Break";
    }

    if (mode === "focus" && canStartBreak) {
      return "Start Break";
    }

    if (mode === "break") {
      return "Resume Break";
    }

    return secondsLeft === FOCUS_SECONDS_TOTAL ? "Start" : "Resume";
  };

  const modeDescription =
    mode === "focus"
      ? "Your focus sprint is active. Keep your attention on one clear target."
      : "Quick reset. Stand up, breathe, and return ready.";

  return (
    <VStack spacing={6} align="stretch">
      <Box
        px={6}
        py={8}
        borderRadius="card"
        bg="linear-gradient(165deg, rgba(255,255,255,0.96) 0%, rgba(245,248,244,0.9) 100%)"
        border="1px solid"
        borderColor="study.border"
        boxShadow={isRunning ? "cardHover" : "card"}
        transform={isRunning ? "translateY(-1px)" : "none"}
        transition="all 0.2s ease"
      >
        <Text
          fontSize="sm"
          textTransform="uppercase"
          letterSpacing="wide"
          color="study.inkMuted"
        >
          {mode === "focus" ? "Focus Session" : "Break Time"}
        </Text>
        <Text mt={1} fontSize="sm" color="study.inkMuted">
          {modeDescription}
        </Text>
        <Text
          fontSize={{ base: "5xl", md: "6xl" }}
          fontWeight="bold"
          lineHeight="1"
          mt={2}
          color="study.ink"
        >
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </Text>
        <Progress
          value={progress}
          mt={5}
          colorScheme="brand"
          borderRadius="full"
          bg="study.border"
          sx={{
            ".chakra-progress__filled-track": {
              transition: "width 0.6s ease",
            },
          }}
        />
        <HStack spacing={3} mt={6}>
          <Button colorScheme="brand" onClick={toggleTimer} minW="160px">
            {primaryLabel()}
          </Button>
          <Button
            variant="outline"
            borderColor="study.border"
            color="study.ink"
            _hover={{ bg: "blackAlpha.50" }}
            onClick={resetTimer}
          >
            Reset
          </Button>
        </HStack>
      </Box>
    </VStack>
  );
}
