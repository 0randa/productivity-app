"use client";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

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
    }, 100);
  }, [time]);

  function toggleTimer() {
    if (!startTimer) {
      setTime((prev) => ({ ...prev, seconds: prev.seconds - 1 + 1 }));
    }
    setStartTimer(!startTimer);
  }

  function resetTimer() {
    setStartTimer(false);
    setTime({ minutes: MINUTES, seconds: SECONDS });
  }

  return (
    <>
      <div className="mx-auto">
        <h1 className="text-center">
          {time.minutes}:{time.seconds < 10 ? "0" + time.seconds : time.seconds}
        </h1>
      </div>

      <Container>
        <Row className="justify-content-md-center">
          <Col xs="auto">
            <div>
              <Button onClick={toggleTimer} variant="primary">
                {startTimer ? "Pause Timer" : "Start Timer"}
              </Button>
              <Button onClick={resetTimer} variant="secondary">
                Reset Timer
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}
