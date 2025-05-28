"use client";
import Button from "react-bootstrap/Button";

import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";

const SECONDS = 0;
const MINUTES = 2;

export default function TimerComp() {
  const [time, setTime] = useState({ minutes: MINUTES, seconds: SECONDS });
  const [startTimer, setStartTimer] = useState(false);

  // timer effect hook
  useEffect(() => {
    if ((time.minutes <= 0 && time.seconds <= 0) || !startTimer) return;

    if (time.seconds == 0) {
      setTime((prev) => ({
        minutes: prev.minutes - 1,
        seconds: 59,
      }));
      return;
    }

    setTimeout(() => {
      setTime((prev) => ({ ...prev, seconds: prev.seconds - 1 }));
    }, 500);
  }, [time]);

  function toggleTimer() {
    if (!startTimer) {
      setTime((prev) => ({ ...prev, seconds: prev.seconds - 1 + 1 }));
    }
    setStartTimer(!startTimer);
  }

  return (
    <>
      <Button onClick={toggleTimer} variant="primary">
        Start Timer
      </Button>
      <div className="mx-auto">
        <h1 className="text-center">
          {time.minutes}:{time.seconds < 10 ? "0" + time.seconds : time.seconds}
        </h1>
      </div>
    </>
  );
}
