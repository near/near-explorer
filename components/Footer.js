import Link from "next/link";

import { Container, Row, Col } from "react-bootstrap";

const Footer = () => (
  <Container fluid="true" className="near-main-container">
    <Row className="footer-container" noGutters="true">
      <Col className="align-self-center" md="auto">
        <img className="near-logo" src="/static/images/near.svg" />
      </Col>
      <Col className="footer-nav-margin" md="auto" />
      <Col className="align-self-center footer-link" md="auto">
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
      <Col className="text-right">
        <a className="footer-help-link" href="http://near.chat" target="_blank">
          <img className="help-image" src="/static/images/footer-nearkat.svg" />
          <div className="footer-help my-auto">
            <span className="need-help-contact">Need Help?</span>
            <span className="need-help-contact need-help-contact-bottom">
              Contact Support
            </span>
          </div>
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
        margin-left: 0;
        margin-right: 0;
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
        width: 250px;
        height: 100px;
        display: table-cell;
        text-align: left;
        padding-left: 50px;
        line-height: 1px;
        padding-top: 25px;
      }

      .help-image {
        width: 90px;
        position: relative;
        right: -50px;
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

export default Footer;
