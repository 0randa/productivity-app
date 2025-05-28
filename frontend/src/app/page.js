"use client";

// import Image from "next/image";
import styles from "./page.module.css";
import { Container, Button, Row, Col, Image } from "react-bootstrap";
import TimerComp from "@/components/timer";
import Tasks from "@/components/tasks";
import { useEffect, useState } from "react";
import { NavbarComp } from "@/components/navbar";

export default function Home() {
  const [image, setImage] = useState(null);

  const pokemon = "Dialga";

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
          <Col>
            <h2>
              {pokemon} {"Lv. 50"}
            </h2>
            <Image
              src={image}
              alt="Description"
              className="w-50"
              fluid
              rounded
            />
            <Button variant="info">Show stats</Button>
          </Col>
        </Row>
        <Tasks />
      </Container>
    </>
  );
}
