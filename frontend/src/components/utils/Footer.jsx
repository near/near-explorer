import Link from "next/link";

import { Container, Row, Col } from "react-bootstrap";

export default () => (
  <Container fluid className="footer-container">
    <Row>
      <Col className="align-self-center text-center px-0" xs="12" md="3">
        <img className="near-logo" src="/static/images/near.svg" />
      </Col>
      <Col
        className="align-self-center footer-link text-md-left text-center pl-0"
        xs="12"
        md="5"
      >
        © 2019 NEAR Inc. All Rights Reserved.
        <br />
        <Link href="terms-of-service">
          <a className="footer-link-href">Terms of Service</a>
        </Link>
        &nbsp;|&nbsp;
        <Link href="privacy-policy">
          <a className="footer-link-href">Privacy Policy</a>
        </Link>
      </Col>
      <Col className="text-right d-none d-sm-block ml-auto" md="4" lg="2">
        <a className="footer-help-link" href="http://near.chat" target="_blank">
          <Row noGutters>
            <Col md="2">
              <img
                className="help-image img-responsive"
                src="/static/images/footer-nearkat.svg"
              />
            </Col>
            <Col className="align-self-center">
              <div className="footer-help">
                <span className="need-help-contact">Need Help?</span>
                <span className="need-help-contact need-help-contact-bottom">
                  Contact Us
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
        height: 120px;
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
        background-color: #ffffff;
        height: 80px;
        text-align: left;
        line-height: 1px;
        padding: 8% 20%;
      }

      .help-image {
        margin-top: -50%;
        position: relative;
        z-index: 2;
        left: -35px;
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
    `}</style>
  </Container>
);
