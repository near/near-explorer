import { Container, Row, Col } from "react-bootstrap";

const Content = props => (
  <Container className="content-container near-main-container" fluid="true">
    <Container>
      <Row>
        <Col>
          <br />
          <p className="content-title">{props.title}</p>
        </Col>
        {props.count !== undefined ? (
          <Col className="text-right">
            <br />
            <span className="content-title">
              {parseInt(props.count).toLocaleString()}
            </span>
            &nbsp;&nbsp;
            <span className="content-title-total">total</span>
          </Col>
        ) : null}
      </Row>
      {props.title.toLowerCase() !== "dashboard" ? (
        <Row>
          <Col>
            <hr className="content-title-margin" />
          </Col>
        </Row>
      ) : null}
      {props.children}
    </Container>
    <style jsx global>{`
      .content-container {
        background: white;
      }

      .content-title {
        font-size: 50px;
      }

      .content-title-total {
        font-size: 50px;
        color: rgba(0, 0, 0, 0.4);
      }

      .content-title-margin {
        margin-top: -5px !important;
        border-top: 4px solid rgba(0, 0, 0, 0.1);
      }
    `}</style>
  </Container>
);

export default Content;
