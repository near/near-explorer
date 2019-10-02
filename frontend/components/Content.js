import { Container, Row, Col } from "react-bootstrap";

const Content = props => {
  const size = props.size || "big";
  return (
    <Container
      className={`content-container content-${size} near-main-container`}
      fluid="true"
      style={props.style}
    >
      <Container>
        <Row>
          <Col>
            <br />
            <Row>
              {props.icon ? (
                <Col xs="1" md="auto" className="content-icon-col">
                  {props.icon}
                </Col>
              ) : null}
              <Col
                className={`${
                  props.icon ? "px-0" : ""
                } content-title text-md-left text-center`}
              >
                {props.title}
              </Col>
            </Row>
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
          font-weight: 500;
          color: #24272a;
        }

        .content-title-total {
          color: rgba(0, 0, 0, 0.4);
        }

        .content-big .content-title {
          font-size: 48px;
        }

        .content-big .content-title-total {
          font-size: 50px;
        }

        .content-medium .content-title {
          font-size: 24px;
        }

        .content-medium .content-title-total {
          font-size: 26px;
        }

        .content-title-margin {
          border-top: 4px solid rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </Container>
  );
};

export default Content;
