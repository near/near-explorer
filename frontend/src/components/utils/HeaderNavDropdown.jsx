import { Dropdown } from "react-bootstrap";

const HeaderNavItem = ({ link, imgLink, text }) => {
  return (
    <Dropdown.Item className="header-nav-item" href={link}>
      <img src={imgLink} className="header-icon" />
      <span className="nav-text">{text}</span>
      <style jsx global>{`
        .header-nav-link,
        .header-nav-link:hover {
          text-decoration: none;
        }

        .header-icon {
          width: 16px !important;
          margin-right: 3px;
        }

        .nav-text {
          letter-spacing: 2px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          margin-left: 10px;
        }
        .header-nav-item {
          color: #a5a5a5;
        }
        .header-nav-item:hover {
          background: #000000;
          color: white;
        }
      `}</style>
    </Dropdown.Item>
  );
};

export default () => (
  <Dropdown>
    <Dropdown.Toggle className="chain-header">
      Explore
      <img src="/static/images/down-arrow.svg" className="dropdown-arrow" />
    </Dropdown.Toggle>
    <Dropdown.Menu className="header-dropdown-menu">
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
      .chain-header {
        color: #000000;
        background: #ffffff;
        border: none;
        font-weight: 500;
        width: 100%;
      }

      .chain-header:hover,
      .chain-header:focus,
      .chain-header:active,
      .show > .btn-primary.dropdown-toggle {
        background: #ffffff !important;
        color: #000000 !important;
        border: none;
      }

      .dropdown-toggle::after {
        content: none;
      }

      .header-dropdown-menu {
        background: #25272a;
        border-radius: 8px;
      }

      .dropdown-arrow {
        margin-left: 9px;
      }

      .show > .dropdown-toggle > .dropdown-arrow {
        transform: rotate(180deg);
      }
    `}</style>
  </Dropdown>
);
