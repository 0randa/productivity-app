"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { Container } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import TimerComp from "@/components/timer";
import Tasks from "@/components/tasks";

import { NavbarComp } from "@/components/navbar";

export default function Home() {
  return (
    <>
      <NavbarComp />
      <Container>
        <TimerComp />
        <Tasks />
      </Container>
    </>
  );
}
