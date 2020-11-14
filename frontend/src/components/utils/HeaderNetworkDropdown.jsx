import { Dropdown } from "react-bootstrap";

import { NetworkConsumer } from "../../context/NetworkProvider";

const HeaderDropdownItem = ({ link, title }) => (
  <Dropdown.Item className="header-network-item-dropdown" href={link}>
    <div className="network-icon"></div>
    {title}
  </Dropdown.Item>
);

export default () => (
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
            width: 100%;
            max-width: 150px;
            padding: 5px 2px;
          }

          .header-network:hover,
          .header-network:focus,
          .header-network:active {
            background: #f7f7f7;
            color: #000000;
            border-color: #f7f7f7;
          }

          .header-network-dropdown-menu {
            background: #ffffff;
            padding: 12px;
            box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
            border-radius: 8px;
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
            margin-right: 3px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: ${context.currentNearNetwork.name === "mainnet"
              ? "#00C08B"
              : "#E9B870"};
          }

          .icon-right {
            height: 12px;
            margin-left: 6px;
          }
        `}</style>
      </Dropdown>
    )}
  </NetworkConsumer>
);
