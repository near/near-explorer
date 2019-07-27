import Link from "next/link";

import { Container, Row, Col } from "react-bootstrap";

import HeaderDropdownNav from "./HeaderDropdownNav";

const HeaderNavItem = props => (
  <Col
    className={`align-self-center d-none d-sm-block ${
      props.cls !== undefined ? props.cls : ""
    }`}
    md="auto"
  >
    <Link href={props.link} prefetch>
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
      <Col xs="2" className="px-0 d-md-none align-self-center">
        <img
          className="near-main-logo-mobile"
          src="/static/images/near_icon_wht.svg"
        />
      </Col>

      <Col md="auto" xs="6" className="pl-0  d-none d-sm-block ">
        <img className="near-main-logo" src="/static/images/explorer.png" />
      </Col>

      <HeaderNavItem
        link="/index"
        imgLink="/static/images/icon-home.svg"
        text="Dashboard"
      />
      <HeaderNavItem
        link="/contracts"
        imgLink="/static/images/icon-contract.svg"
        text="Contracts"
      />
      <HeaderNavItem
        link="/transactions"
        imgLink="/static/images/icon-transactions.svg"
        text="Transactions"
      />
      <HeaderNavItem
        link="/blocks"
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
      />

      <Col className="align-self-center d-none d-sm-block" md="auto">
        <span className="header-nav-network-border" />
      </Col>

      <Col className="align-self-center mb-3 mt-3" md="auto" xs="10">
        <HeaderDropdownNav />
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
        width: 100%;
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

      .header-nav-caret {
        position: relative;
      }

      .dropdown.show .header-nav-caret:before,
      .dropdown.show .header-nav-caret:after {
        content: "";
        position: absolute;
        display: block;
        width: 0;
        height: 0;
        border-width: 7px 8px;
        border-style: solid;
        border-color: transparent;
        z-index: 1001;
      }
      .dropdown.show .header-nav-caret:before {
        bottom: -17px;
        right: 10px;
        border-bottom-color: #ccc;
      }
      .dropdown.show .header-nav-caret:after {
        bottom: -17px;
        right: 10px;
        border-bottom-color: #fff;
      }

      .header-nav-item-dropdown-menu {
        padding: 12px;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
        border-radius: 5px;
      }

      .header-nav-item-dropdown {
        font-family: BentonSans;
        font-size: 14px;
        letter-spacing: 1.8px;
        color: #0072ce;
        text-transform: uppercase;
        padding: 6px 40px 6px 6px;
        border-radius: 3px;
      }

      .header-nav-item-dropdown:hover {
        background-color: #e6e6e6;
      }
    `}</style>
  </Container>
);

export default Header;
