import { Container, Row, Col } from "react-bootstrap";
import NearLogo from "../../../public/static/images/near_logo.svg";
import Nearkat from "../../../public/static/images/nearkat_prof.svg";

export default () => (
  <Container fluid className="footer-container">
    <Row>
      <Col className="align-self-center text-center px-0" xs="4" md="3">
        <NearLogo className="near-logo" />
      </Col>
      <Col
        className="align-self-center footer-link text-md-left text-center pl-0"
        xs="8"
        md="5"
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
      <Col className="text-right d-none d-sm-block ml-auto" md="4" lg="3">
        <a className="footer-help-link" href="http://near.chat" target="_blank">
          <Row>
            <Col md="2">
              <Nearkat className="help-image img-responsive" />
            </Col>
            <Col className="align-self-center footer-help">
              <div>
                <span className="need-help-contact">Questions?</span>
                <span className="need-help-contact need-help-contact-bottom">
                  Join the Community
                </span>
              </div>
            </Col>
          </Row>
        </a>
      </Col>
    </Row>
    <style jsx global>{`
      .footer-container {
        background-color: #f8f8f8;
        font-family: BentonSans;
        font-size: 12px;
        line-height: 40px;
        color: #999999;
        height: 100px;
        width: 100%;
      }

      .footer-container > .col-12 {
        min-height: 70px;
        padding-top: 20px;
        padding-bottom: 25px;
      }

      .footer-link-href {
        color: #999999;
        text-decoration: underline;
      }

      .footer-link {
        line-height: 20px;
      }

      .footer-nav-margin {
        width: 30px;
      }

      .footer-help {
        background: #ffffff;
        box-sizing: border-box;
        text-align: left;
        font-weight: 800;
        font-size: 18px;
        line-height: 24px;
        padding: 24px 40px;
      }

      .help-image {
        height: 150px;
        position: relative;
        z-index: 2;
        top: -20px;
      }

      .need-help-contact {
        font-family: BwSeidoRound;
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
        fill: #acacac;
      }
    `}</style>
  </Container>
);
