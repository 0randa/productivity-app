"use client";

// import Image from "next/image";
import styles from "./page.module.css";
import {
  Container,
  Button,
  Row,
  Col,
  Image,
  Card,
  ProgressBar,
} from "react-bootstrap";
import TimerComp from "@/components/timer";
import Tasks from "@/components/tasks";
import { useEffect, useState } from "react";
import { NavbarComp } from "@/components/navbar";

export default function Home() {
  const [image, setImage] = useState(null);

  const pokemon = "Pikachu";

  function WithLabelExample() {
    const now = 60;
    return <ProgressBar now={now} label={`${now}%`} />;
  }

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
      .then((response) => response.json())
      .then((data) => setImage(data.sprites.front_default))
      .catch((error) => console.error(error));
  }, []);

  return (
    <>
      <NavbarComp />
      <Container>
        <Row>
          <Col>
            <TimerComp />
          </Col>
        </Row>

        <Row>
          <Col>
            <Card style={{ width: "18rem" }}>
              <Card.Img variant="top" src={image} />
              <Card.Body>
                <Card.Title>{pokemon}</Card.Title>
                <Card.Text>Lv. 50</Card.Text>
                <Button variant="primary">Show stats</Button>
              </Card.Body>
            </Card>
          </Col>

          <Col>
            <h1>EXP</h1>
            <h1>CURRENT EXP COUNT</h1>
            <h1>EXP GAINED PER TASK/TIME</h1>
            <h1>PROGRESS BAR</h1>
          </Col>
        </Row>

        <Tasks />
      </Container>
    </>
  );
}
