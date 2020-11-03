import { Container, Row, Col } from "react-bootstrap";
import Link from "next/link";

import HeaderNetwrokDropdown from "./HeaderNetwrokDropdown";
import HeaderNavDropdown from "./HeaderNavDropdown";
import Search from "../utils/Search";

export default ({ dashboard }) => (
  <Container fluid className="near-main-container">
    <Row className="header-container">
      <Col xs="2" className="px-0 d-md-none align-self-center">
        <Link href="/">
          <a>
            <img
              className="near-main-logo-mobile"
              src="/static/images/near_logo.svg"
            />
          </a>
        </Link>
      </Col>

      <Col md="auto" xs="6" className="pl-0  d-none d-md-block ">
        <Link href="/">
          <a>
            <img
              className="near-main-logo"
              src="/static/images/near_logo.svg"
            />
          </a>
        </Link>
      </Col>

      <Col className="align-self-center mb-3 mt-3" md="auto">
        <HeaderNetwrokDropdown />
      </Col>

      <Col className="align-self-center mb-3 mt-3" md="6">
        {!dashboard && <Search />}
      </Col>

      <Col
        className="align-self-center mb-3 mt-3"
        style={{ textAlign: "center" }}
      >
        <Link href="/">
          <a className="near-home">Home</a>
        </Link>
      </Col>

      <Col className="align-self-center mb-3 mt-3" md="auto">
        <HeaderNavDropdown />
      </Col>
    </Row>
    <style jsx global>{`
      .near-main-container {
        width: 100%;
        padding: auto 5px;
      }

      .header-container {
        background: #ffffff;
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
      }

      .near-main-logo {
        width: 180px !important;
        padding: 14px;
      }

      .near-home {
        font-weight: 500;
        color: #000000;
        margin: auto;
      }
    `}</style>
  </Container>
);
