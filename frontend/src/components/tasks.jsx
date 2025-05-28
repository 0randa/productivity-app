"use client";
import ListGroup from "react-bootstrap/ListGroup";
import { Row } from "react-bootstrap";
import { Col } from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";

export default function Tasks() {
  return (
    <>
      <Row>
        <Col lg="8">
          <h1>Tasks</h1>
          <ListGroup>
            <ListGroup.Item>Finish lectures</ListGroup.Item>
            <ListGroup.Item>Preview tutorial</ListGroup.Item>
            <ListGroup.Item>Do labs</ListGroup.Item>
            <ListGroup.Item>Work on assignment</ListGroup.Item>
          </ListGroup>
        </Col>
        <Col>
          <h1>Stats</h1>
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Total Timers Started</Accordion.Header>
              <Accordion.Body>0</Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>Total Timers Finished</Accordion.Header>
              <Accordion.Body>0</Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2">
              <Accordion.Header>Total Timers Finished</Accordion.Header>
              <Accordion.Body>0</Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="3">
              <Accordion.Header>Total Timers Reset</Accordion.Header>
              <Accordion.Body>0</Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
      </Row>
    </>
  );
}
