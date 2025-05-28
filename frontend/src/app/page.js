"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { Container } from "react-bootstrap";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import TimerComp from "@/components/timer";

import { NavbarComp } from "@/components/navbar";

export default function Home() {
  return (
    <>
      <NavbarComp />
      <Container>
        <Row>
          <TimerComp />
        </Row>
        <Row>
          <Col>1 of 3</Col>
          <Col xs={5}>2 of 3 (wider)</Col>
          <Col>3 of 3</Col>
        </Row>
      </Container>
    </>
  );
}
