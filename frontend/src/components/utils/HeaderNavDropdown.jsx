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
          color: #ffffff;
          letter-spacing: 2px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
        }

        .header-nav-item {
          padding: 10px 20px !important;
          padding-right: 30px !important;
        }

        .header-nav-item:hover {
          background: #000000;
        }
      `}</style>
    </Dropdown.Item>
  );
};

export default () => (
  <Dropdown>
    <Dropdown.Toggle variant="secondary" className="chain-header">
      Chain-Info
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
        link="/validators"
        imgLink="/static/images/icon-nodes.svg"
        text="Nodes"
      />
    </Dropdown.Menu>

    <style jsx global>{`
      .chain-header,
      .chain-header:hover {
        color: #000000;
        background: #ffffff;
        border: none;
        font-weight: 500;
      }
      .header-dropdown-menu {
        background: #25272a;
        border-radius: 8px;
      }
    `}</style>
  </Dropdown>
);
