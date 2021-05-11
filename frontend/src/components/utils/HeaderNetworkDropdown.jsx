import { Dropdown } from "react-bootstrap";

import { NetworkConsumer } from "../../context/NetworkProvider";
import Mixpanel from "../../libraries/mixpanel";

const HeaderDropdownItem = ({ link, title }) => {
  return (
    <Dropdown.Item
      className="header-network-item-dropdown"
      href={link}
      onClick={() =>
        Mixpanel.track("Explorer Click to change network", { network: link })
      }
    >
      <div className={`network-icon network-${title.toLowerCase()}`}></div>
      {title}
    </Dropdown.Item>
  );
};

const HeaderNetworkDropdown = () => (
  <NetworkConsumer>
    {(context) => (
      <Dropdown>
        <Dropdown.Toggle className="header-network" variant="secondary">
          <div className="network-icon"></div>
          {context.currentNearNetwork.name}
          <img
            className="icon-right"
            src="/static/images/icon-network-right.svg"
          />
          <img
            src="/static/images/down-blue-arrow.svg"
            className="dropdown-arrow"
          />
        </Dropdown.Toggle>
        <Dropdown.Menu className="header-network-dropdown-menu">
          {context.nearNetworks.map((network) => {
            return (
              <HeaderDropdownItem
                key={network.name}
                title={network.name}
                link={network.explorerLink}
              />
            );
          })}
        </Dropdown.Menu>
        <style jsx global>{`
          .header-network {
            background: #ffffff;
            border: 2px solid #f1f1f1;
            box-sizing: border-box;
            box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
            border-radius: 50px;
            color: #000000;
            text-transform: capitalize;
            width: 154px;
            height: 33px;
            padding: 3px 2px;
            font-size: 14px;
            outline: none;
          }

          .header-network:hover,
          .header-network:focus,
          .header-network:active,
          .header-network:focus:active,
          .show > .header-network.dropdown-toggle {
            background: #f7f7f7 !important;
            color: #000000 !important;
            box-shadow: none !important;
            border: 0 solid #f1f1f1 !important;
          }
          .header-network.dropdown-toggle {
            border: 2px solid #f1f1f1;
          }

          .btn-secondary:focus {
            box-shadow: none;
          }

          .header-network-dropdown-menu {
            background: #ffffff;
            padding: 12px;
            box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
            border-radius: 8px;
            border: none;
          }

          .dropdown-menu {
            min-width: 154px;
          }

          .header-network-item-dropdown {
            font-size: 14px;
            letter-spacing: 1.8px;
            color: #8d8d8d;
            padding: 6px 40px 6px 6px;
            border-radius: 3px;
            text-transform: capitalize;
          }

          .header-network-item-dropdown:hover,
          .header-network-item-dropdown:active {
            background-color: #e6e6e6;
          }

          .network-icon {
            display: inline-block;
            margin-right: 8px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: ${context.currentNearNetwork.name === "mainnet"
              ? "#00C08B"
              : context.currentNearNetwork.name === "testnet"
              ? "#E9B870"
              : context.currentNearNetwork.name === "betanet"
              ? "#00C1DE"
              : "#0072CE"};
          }

          .network-icon.network-mainnet {
            background: #00c08b;
          }

          .network-icon.network-testnet {
            background: #e9b870;
          }

          .network-icon.network-betanet {
            background: #00c1de;
          }

          .network-icon.network-guildnet {
            background: #0072ce;
          }

          .icon-right {
            height: 15px;
            width: 15px;
            margin-left: 16px;
            margin-top: -3px;
          }
        `}</style>
      </Dropdown>
    )}
  </NetworkConsumer>
);

export default HeaderNetworkDropdown;
