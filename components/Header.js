import Link from "next/link";

import { Container, Row, Col } from "react-bootstrap";

const HeaderNavItem = props => (
  <Col className="align-self-center" md="auto">
    <Link href={props.link}>
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
        color: #ffffff;
        padding-left: 0px;
        padding-right: 25px;
        letter-spacing: 2px;
        text-decoration: none;
        text-transform: uppercase;
        font-family: BentonSans;
        font-size: 14px;
        font-weight: 500;
      }
    `}</style>
  </Col>
);

const Header = () => (
  <Container fluid="true" className="near-main-container">
    <Row className="header-container" noGutters="true">
      <Col className="align-self-center" md="auto">
        <img className="near-main-logo" src="/static/images/explorer.png" />
      </Col>

      <HeaderNavItem
        link="index"
        imgLink="/static/images/icon-home.svg"
        text="Dashboard"
      />
      <HeaderNavItem
        link="contracts"
        imgLink="/static/images/icon-contract.svg"
        text="Contracts"
      />
      <HeaderNavItem
        link="transactions"
        imgLink="/static/images/icon-transactions.svg"
        text="Transactions"
      />
      <HeaderNavItem
        link="blocks"
        imgLink="/static/images/icon-blocks.svg"
        text="Blocks"
      />

      <Col />

      <HeaderNavItem
        link="http://near.chat/"
        imgLink="/static/images/icon-help.svg"
        text="Help"
      />
      <HeaderNavItem
        link="https://github.com/nearprotocol/near-explorer/issues"
        imgLink="/static/images/icon-issues.svg"
        text="Issues"
      />

      <Col className="align-self-center" md="auto">
        <span className="header-nav-network" />
        <a className="header-nav-link">
          <img src="/static/images/icon-nodes.svg" className="header-icon" />
          <span className="header-nav-item">Testnet One</span>
          <i className="arrow-down" />
        </a>
      </Col>
    </Row>
    <style jsx global>{`
      @font-face {
        font-family: "BentonSans";
        src: url("/static/fonts/BentonSans-Medium.otf") format("opentype");
      }

      .header-container {
        background-color: #24272a;
      }

      .near-main-logo {
        width: 220px !important;
        margin-right: 10px;
      }

      .near-main-container {
        width: 80%;
        margin: 0 auto;
        padding-left: 0 !important;
        padding-right: 0 !important;
      }

      .header-nav-network {
        border-left: 1px solid rgba(255, 255, 255, 0.5);
        padding: 12px;
      }

      .arrow-down {
        border: solid #8dd4bd;
        border-width: 0 2px 2px 0;
        display: inline-block;
        padding: 3px;
        transform: rotate(45deg);
        margin-right: 25px;
      }
    `}</style>
  </Container>
);

export default Header;
