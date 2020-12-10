import { Container, Row, Col } from "react-bootstrap";
import NearLogo from "../../../public/static/images/near_logo.svg";
import Nearkats from "../../../public/static/images/nearkats.svg";

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
          <Col className="help-image" xs="5" md="5">
            <Nearkats className="nearkat" />
          </Col>
          <Col className="align-self-start footer-help" xs="7" md="7">
            <span className="need-help-contact">Questions?</span>
            <span className="need-help-contact need-help-contact-bottom">
              Join the Community
            </span>
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
        width: 1044px;
        font-weight: normal;
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
        line-height: 24px;
        padding-top: 22px;
        width: 175px;
      }

      .help-image {
        position: relative;
        z-index: 2;
        left: 10px;
        top: -7px;
      }

      .need-help-contact {
        font-family: "Inter", sans-serif;
        font-size: 18px;
        font-weight: 900;
        color: #999999;
        text-decoration: none !important;
      }

      .footer-help-link:hover {
        text-decoration: none !important;
      }

      .need-help-contact-bottom {
        color: #0072ce !important;
        display: block;
        font-weight: 600;
      }

      .near-logo {
        width: 100px;
      }

      .nearkat-wrapper {
        background: #ffffff;
        border: 1px solid #dadada;
        box-sizing: border-box;
        border-radius: 3px;
        width: 368px;
        height: 92px;
      }

      @media (max-width: 415px) {
        .footer-container {
          flex-direction: column-reverse;
          width: 100%;
          padding: 0;
          height: 92px;
        }

        .nearlogo-wrapper {
          width: 100%;
          height: 100%;
          padding: 10px;
        }

        .need-help-contact {
          font-size: 14px;
        }

        .nearkat-wrapper {
          margin-left: auto;
          width: 100%;
          border: none;
        }

        .help-image {
          top: -5px;
        }
      }
    `}</style>
  </Container>
);
