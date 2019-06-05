import Link from "next/link";

import { Container, Row, Col } from "react-bootstrap";

const HeaderNavItem = props => (
  <Col className="align-self-center" md="auto">
    <Link href="index">
      <a className="header-nav-link">
        <img src={props.imgLink} className="header-icon" />
        <span className="header-nav-item">{props.text}</span>
      </a>
    </Link>

    <style jsx global>{`
      .header-nav-link {
        text-decoration: none;
      }

      .header-nav-link:hover {
        text-decoration: none;
      }

      .header-icon {
        width: 24px !important;
        margin-right: 15px;
      }

      .header-nav-item {
        color: white;
        font-weight: 500;
        font-size: 16px;
        padding-left: 0px;
        padding-right: 30px;
        letter-spacing: 2px;
        text-decoration: none;
        text-transform: uppercase;
      }
    `}</style>
  </Col>
);

const Header = () => (
  <Container>
    <Row className="header-container">
      <Col className="align-self-center" md="auto">
        <img className="near-main-logo" src="/static/explorer.png" />
      </Col>

      <HeaderNavItem imgLink="/static/icon-home.svg" text="Dashboard" />
      <HeaderNavItem imgLink="/static/icon-home.svg" text="Contracts" />
      <HeaderNavItem imgLink="/static/icon-home.svg" text="Transactions" />
      <HeaderNavItem imgLink="/static/icon-home.svg" text="Blocks" />
    </Row>
    <style jsx global>{`
      .header-container {
        background-color: #24272a;
      }

      .near-main-logo {
        width: 220px !important;
      }
    `}</style>
  </Container>
);

export default Header;
