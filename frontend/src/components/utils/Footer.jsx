import { Container, Row, Col } from "react-bootstrap";
import NearLogo from "../../../public/static/images/near_logo.svg";
import Nearkat from "../../../public/static/images/footer-nearkat.svg";

export default () => (
  <Container fluid className="footer-container">
    <div className="nearlogo-wrapper">
      <Row>
        <Col className="align-self-center text-center px-0" xs="4" md="3">
          <NearLogo className="near-logo" />
        </Col>
        <Col
          className="align-self-center footer-link text-md-left text-center pl-0"
          xs="8"
          md="4"
        >
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
      </Row>
    </div>
    <div className="nearkat-wrapper">
      <a className="footer-help-link" href="http://near.chat" target="_blank">
        <Row>
          <Col className="help-image" xs="3" md="3">
            <Nearkat className="nearkat" />
          </Col>
          <Col className="align-self-center footer-help" xs="9" md="9">
            <div>
              <span className="need-help-contact">Questions?</span>
              <span className="need-help-contact need-help-contact-bottom">
                Join the Community
              </span>
            </div>
          </Col>
        </Row>
      </a>
    </div>
    <style jsx global>{`
      .footer-container {
        background-color: #f8f8f8;
        font-family: "Inter", sans-serif;
        font-size: 12px;
        line-height: 40px;
        color: #999999;
        height: 100px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        flex-direction: row;
        margin-top: 150px;
      }

      .footer-container > .col-12 {
        min-height: 70px;
        padding-top: 20px;
        padding-bottom: 25px;
      }

      .nearlogo-wrapper {
        padding: 30px;
        width: 80%;
      }

      .footer-link-href {
        color: #999999;
        text-decoration: underline;
      }

      .footer-link {
        line-height: 20px;
      }

      .footer-container .near-logo {
        height: 60px;
        fill: #acacac;
      }

      .footer-help {
        text-align: left;
        line-height: 1px;
        background: white;
        padding: 25px 35px;
      }

      .help-image {
        position: relative;
        left: -10px;
        z-index: 2;
        top: -20px;
      }

      .need-help-contact {
        font-family: "Inter", sans-serif;
        font-size: 18px;
        font-weight: 900;
        line-height: 1.33;
        color: #999999;
        text-decoration: none !important;
      }

      .footer-help-link:hover {
        text-decoration: none !important;
      }

      .need-help-contact-bottom {
        color: #0072ce !important;
        display: block;
      }

      .near-logo {
        width: 100px;
      }

      @media (max-width: 770px) {
        .footer-container {
          flex-direction: column-reverse;
        }
        .nearlogo-wrapper {
          width: 100%;
        }

        .need-help-contact {
          font-size: 14px;
        }

        .footer-help {
          padding: 15px;
        }

        .nearkat-wrapper {
          margin-left: auto;
          width: 220px;
        }

        .nearkat {
          height: 100px;
        }
      }
    `}</style>
  </Container>
);
