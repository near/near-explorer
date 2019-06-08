import Link from "next/link";

import { Container, Row, Col, Dropdown } from "react-bootstrap";

const HeaderNavItem = props => (
  <Col
    className={`align-self-center d-none d-sm-block ${
      props.cls !== undefined ? props.cls : ""
    }`}
    md="auto"
  >
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
        width: 20px !important;
        margin-right: 8px;
      }

      .header-nav-item {
        color: #ffffff;
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
    <Row className="header-container">
      <Col md="auto" xs="6" className="pl-0  d-none d-sm-block ">
        <img className="near-main-logo" src="/static/images/explorer.png" />
      </Col>

      <HeaderNavItem
        link="index"
        imgLink="/static/images/icon-home.svg"
        text="Dashboard"
        cls="pl-0"
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

      <HeaderNavItem
        link="http://near.chat/"
        imgLink="/static/images/icon-help.svg"
        text="Help"
        cls="ml-auto"
      />
      <HeaderNavItem
        link="https://github.com/nearprotocol/near-explorer/issues"
        imgLink="/static/images/icon-issues.svg"
        text="Issues"
        cls="pl-0"
      />

      <Col className="align-self-center d-none d-sm-block px-0" md="auto">
        <span className="header-nav-network-border" />
      </Col>

      <Col className="align-self-center mb-3 mt-3" md="auto" xs="12">
        <Dropdown>
          <Dropdown.Toggle variant="dark" className="header-nav-network">
            <img src="/static/images/icon-nodes.svg" className="header-icon" />
            <span className="header-nav-item">Testnet One</span>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>Testnet One</Dropdown.Item>
            <Dropdown.Item>Testnet Two</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
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
      }

      .near-main-container {
        width: 88%;
      }

      .header-nav-network-border {
        border: solid 1px #979797;
      }

      .header-nav-network {
        width: 100%;
        text-align: left;
      }

      .header-nav-network:after {
        float: right;
        margin-top: 0.5em;
      }
    `}</style>
  </Container>
);

export default Header;
