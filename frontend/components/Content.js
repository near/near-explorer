import { Container, Row, Col } from "react-bootstrap";

const Content = props => (
  <Container className="content-container near-main-container" fluid="true">
    <Container>
      <Row>
        <Col>
          <br />
          <p className="content-title text-md-left text-center">
            {props.title}
          </p>
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
      {props.border !== false ? (
        <Row>
          <Col>
            <hr className="content-title-margin" />
          </Col>
        </Row>
      ) : null}
      {props.children}
    </Container>
    <style jsx global>{`
      @font-face {
        font-family: "BwSeidoRound";
        font-weight: 500;
        src: url("/static/fonts/Branding-with-Type-Bw-Seido-Round-Medium.otf")
          format("opentype");
      }

      @font-face {
        font-family: "BwSeidoRound";
        font-weight: 300;
        src: url("/static/fonts/Branding-with-Type-Bw-Seido-Round-Light.otf")
          format("opentype");
      }

      @font-face {
        font-family: "BwSeidoRound";
        font-weight: 400;
        src: url("/static/fonts/Branding-with-Type-Bw-Seido-Round-Regular.otf")
          format("opentype");
      }

      .content-container {
        background: white;
      }

      .content-title {
        font-family: BwSeidoRound;
        font-size: 48px;
        font-weight: 500;
        color: #24272a;
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
