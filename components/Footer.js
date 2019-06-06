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
          <a>Terms of Service</a>
        </Link>
        &nbsp;|&nbsp;
        <Link href="privacy-policy">
          <a>Privacy Policy</a>
        </Link>
      </Col>
      <Col className="text-right">
        <a href="http://near.chat" target="_blank">
          <img
            className="help-image"
            src="/static/images/need-help-footer.png"
          />
        </a>
      </Col>
    </Row>
    <style jsx global>{`
      .footer-container {
        background-color: #f8f8f8;
        font-size: 12px;
        font-weight: 300;
        line-height: 40px;
        color: #999999;
        margin-left: 0;
        margin-right: 0;
      }

      a {
        color: #999999;
        text-decoration: underline;
      }

      .footer-link {
        line-height: 20px;
      }

      .footer-nav-margin {
        width: 30px;
      }
    `}</style>
  </Container>
);

export default Footer;
