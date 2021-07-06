import { Dropdown } from "react-bootstrap";

import IconAccounts from "../../../public/static/images/icon-accounts.svg";
import IconBlocks from "../../../public/static/images/icon-blocks.svg";
import IconNodes from "../../../public/static/images/icon-nodes.svg";
import IconStats from "../../../public/static/images/icon-stats.svg";
import IconTransactions from "../../../public/static/images/icon-transactions.svg";

import Link from "../utils/Link";

import { Translate } from "react-localize-redux";

const HeaderNavItem = ({ link, icon, text }) => {
  return (
    <Link href={link}>
      <a className="header-nav-item">
        {icon}
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

          .header-nav-link:hover .header-icon {
            stroke: #00c1de;
          }

          .nav-text {
            letter-spacing: 2px;
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
            margin-left: 10px;
          }

          .header-nav-item {
            display: block;
            color: #a5a5a5;
            padding-top: 10px;
            padding-bottom: 15px;
            padding-left: 18px;
            text-decoration: none;
            width: 100%;
            height: 100%;
            cursor: pointer;
          }

          .header-nav-item:hover {
            background: #000000;
            color: white;
          }
        `}</style>
      </a>
    </Link>
  );
};

const HeaderNavDropdown = () => (
  <Translate>
    {({ translate }) => (
      <Dropdown>
        <Dropdown.Toggle className="chain-header">
          {translate("component.utils.HeaderNavDropdown.title")}
          <img src="/static/images/down-arrow.svg" className="dropdown-arrow" />
        </Dropdown.Toggle>
        <Dropdown.Menu className="header-dropdown-menu">
          <HeaderNavItem
            link="/accounts"
            icon={<IconAccounts className="header-icon" />}
            text={translate("model.accounts.title")}
          />
          <HeaderNavItem
            link="/blocks"
            icon={<IconBlocks className="header-icon" />}
            text={translate("model.blocks.title")}
          />
          <HeaderNavItem
            link="/transactions"
            icon={<IconTransactions className="header-icon" />}
            text={translate("model.transactions.title")}
          />
          <HeaderNavItem
            link="/nodes/validators"
            icon={<IconNodes className="header-icon" />}
            text={translate("model.nodes.title")}
          />
          <HeaderNavItem
            link="/stats"
            icon={<IconStats className="header-icon" />}
            text={translate("model.stats.title_charts_and_stats")}
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
            width: 267px;
          }

          .dropdown-arrow {
            margin-left: 9px;
          }

          .show > .dropdown-toggle > .dropdown-arrow {
            transform: rotate(180deg);
          }

          .show > .btn-primary.dropdown-toggle:focus {
            box-shadow: none;
          }

          .btn-primary:focus {
            box-shadow: none;
          }
        `}</style>
      </Dropdown>
    )}
  </Translate>
);

export default HeaderNavDropdown;
