import { Container, Row, Col } from "react-bootstrap";

export default class extends React.Component {
  static defaultProps = {
    size: "big",
    border: true
  };

  render() {
    const { size, border, icon, count } = this.props;

    return (
      <Container
        className={`content-container content-${size} near-main-container`}
        fluid="true"
        style={this.props.style}
      >
        <Container>
          <Row className={`content-header ${border ? "with-border" : ""}`}>
            <Col className="px-0">
              <Row>
                {icon ? (
                  <Col xs="1" md="auto" className="content-icon-col">
                    {icon}
                  </Col>
                ) : null}
                <Col
                  className={`${
                    icon ? "px-0" : ""
                  } content-title text-md-left text-center`}
                >
                  {this.props.title}
                </Col>
              </Row>
            </Col>
            {count !== undefined ? (
              <Col className="text-right">
                <br />
                <span className="content-title">
                  {parseInt(count).toLocaleString()}
                </span>
                &nbsp;&nbsp;
                <span className="content-title-total">total</span>
              </Col>
            ) : null}
          </Row>
          {this.props.children}
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

          .content-header {
            padding: 2em 0 1em;
            margin-left: 0;
            margin-right: 0;
          }

          .content-header.with-border {
            border-bottom: 4px solid #e5e5e5;
            margin-bottom: 1em;
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
  }
}
