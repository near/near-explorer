import Link from "next/link";

import { Container, Row, Col } from "react-bootstrap";

const Footer = () => (
  <Container>
    <Row className="footer-container">
      <Col className="align-self-center" md="auto">
        <img className="near-logo" src="/static/near.svg" />
      </Col>
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
          <img className="help-image" src="/static/need-help-footer.png" />
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
      }

      a {
        color: #999999;
        text-decoration: underline;
      }

      .footer-link {
        line-height: 20px;
      }
    `}</style>
  </Container>
);

export default Footer;
