import { Dropdown } from "react-bootstrap";

import { HeaderNavItem } from "./HeaderNavDropdown";

export default () => (
  <Dropdown>
    <Dropdown.Toggle variant="secondary" className="chain-header">
      ☰
    </Dropdown.Toggle>
    <Dropdown.Menu className="header-dropdown-menu-mobile">
      <Dropdown.Item className="header-nav-item white" href="/">
        Home
      </Dropdown.Item>
      <Dropdown.Item className="header-nav-item white">Explore</Dropdown.Item>
      <HeaderNavItem
        link="/accounts"
        imgLink="/static/images/icon-accounts.svg"
        text="Accounts"
      />
      <HeaderNavItem
        link="/blocks"
        imgLink="/static/images/icon-blocks.svg"
        text="Blocks"
      />
      <HeaderNavItem
        link="/transactions"
        imgLink="/static/images/icon-transactions.svg"
        text="Transactions"
      />
      <HeaderNavItem
        link="/nodes/validators"
        imgLink="/static/images/icon-nodes.svg"
        text="Nodes"
      />
    </Dropdown.Menu>

    <style jsx global>{`
      .header-dropdown-menu-mobile {
        background: #25272a;
        width: 100%;
      }

      .dropdown {
        width: 100%;
      }

      .dropdown-toggle:hover,
      .dropdown-toggle:focus,
      .dropdown-toggle:active {
        background: #f7f7f7;
        border-radius: 50px;
      }

      .white {
        color: white;
      }
    `}</style>
  </Dropdown>
);
