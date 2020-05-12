import { Container, Row, Col } from "react-bootstrap";
import Link from "next/link";

import HeaderDropdownNav from "./HeaderDropdownNav";
import HeaderNavItem from "./HeaderNavItem";

export default () => (
  <Container fluid className="near-main-container">
    <Row className="header-container">
      <Col xs="2" className="px-0 d-md-none align-self-center">
        <Link href="/">
          <a>
            <img
              className="near-main-logo-mobile"
              src="/static/images/near_icon_wht.svg"
            />
          </a>
        </Link>
      </Col>

      <Col md="auto" xs="6" className="pl-0  d-none d-md-block ">
        <Link href="/">
          <a>
            <img className="near-main-logo" src="/static/images/explorer.svg" />
          </a>
        </Link>
      </Col>

      <HeaderNavItem
        link="/"
        imgLink="/static/images/icon-home.svg"
        text="Dashboard"
      />
      <HeaderNavItem
        link="/accounts"
        imgLink="/static/images/icon-contract.svg"
        text="Accounts"
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
      .modal-body {
        font-family: BentonSans;
        font-weight: 300;
      }

      .header-container {
        background-color: #24272a;
      }

      .near-main-logo {
        width: 210px !important;
        padding: 15px;
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
