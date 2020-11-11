import { Container, Row, Col } from "react-bootstrap";

export default () => (
  <Container fluid className="footer-container">
    <Row noGutters>
      <Row className="align-self-right text-left">
        <div className="help-bar bar-responsive">
          <div>
            <a href="http://near.chat" target="_blank">
              <div className="help-text">
                <p className="need-help-contact">Need Help?</p>
                <p className="need-help-contact need-help-contact-bottom">
                  Join Community
                </p>
              </div>
            </a>
          </div>
          <div className="near-prof">
            <img className="help-image" src="/static/images/nearkat-prof.svg" />
          </div>
        </div>
      </Row>
      <Row className="bar">
        <Col className="align-self-center text-center" xs="4" md="3">
          <img className="near-logo" src="/static/images/near_logo.svg" />
        </Col>
        <Col className="align-self-center footer-link text-left" xs="8" md="5">
          © {new Date().getFullYear()} NEAR Inc. All Rights Reserved.
          <br />
          <a className="footer-link-href" href="https://near.org/privacy/">
            Terms of Service
          </a>
          &nbsp;|&nbsp;
          <a className="footer-link-href" href="https://near.org/privacy/">
            Privacy Policy
          </a>
        </Col>
        <Col xs="0" md="4">
          <div className="help-bar bar-inverse">
            <div>
              <img
                className="help-image"
                src="/static/images/nearkat-prof.svg"
              />
            </div>
            <div>
              <a href="http://near.chat" target="_blank">
                <div className="help-text">
                  <p className="need-help-contact">Need Help?</p>
                  <p className="need-help-contact need-help-contact-bottom">
                    Join Community
                  </p>
                </div>
              </a>
            </div>
          </div>
        </Col>
      </Row>
    </Row>
    <style jsx global>{`
      .footer-container {
        background-color: #f8f8f8;
        font-weight: normal;
        font-size: 12px;
        color: #999999;
        width: 100%;
        height: 100px;
      }

      .bar {
        width: 100%;
        height: 100px;
      }

      .near-logo {
        width: 90px;
      }

      .footer-link-href {
        color: #999999;
        text-decoration: underline;
      }

      .footer-link {
        line-height: 20px;
      }

      .need-help-contact {
        font-weight: 800;
        font-size: 18px;
        line-height: 20px;
        color: #999999;
        text-decoration: none !important;
      }

      .need-help-contact-bottom {
        color: #0072ce !important;
        display: block;
      }

      .help-text {
        background: #ffffff;
        padding: 25px 60px;
      }

      .help-text:hover {
        text-decoration: none !important;
      }

      .help-image {
        position: relative;
        left: 50px;
        z-index: 1;
        height: 140px;
      }

      .near-prof {
        position: relative;
        left: 160px;
        top: -120px;
      }

      .help-bar {
        width: 100%;
        display: flex;
        flex-direction: row;
      }

      .bar-responsive {
        display: none;
      }

      .bar-inverse {
        position: relative;
        right: 0;
      }

      @media (max-width: 763px) {
        .bar-responsive {
          display: block;
          position: relative;
          left: 0;
          bottom: -100px;
        }
        .bar-inverse {
          display: none;
        }
      }
    `}</style>
  </Container>
);
