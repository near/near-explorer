import { Container, Row, Col } from "react-bootstrap";

const Content = props => (
  <Container className="content-container near-main-container" fluid="true">
    <Container>
      <Row>
        <Col>
          <br />
          <p className="content-title">{props.title}</p>
        </Col>
      </Row>
      {props.children}
    </Container>
    <style jsx global>{`
      .content-container {
        background: white;
      }

      .content-title {
        font-size: 50px;
      }
    `}</style>
  </Container>
);

export default Content;
