import { Dropdown } from "react-bootstrap";

import { NetworkConsumer } from "./NetworkProvider";

const HeaderDropdownItem = ({ link, title }) => (
  <Dropdown.Item className="header-nav-item-dropdown" href={link}>
    {title}
  </Dropdown.Item>
);

const HeaderDropdownNav = () => (
  <NetworkConsumer>
    {(context) => (
      <Dropdown>
        <Dropdown.Toggle variant="dark" className="header-nav-network">
          <img src="/static/images/icon-nodes.svg" className="header-icon" />
          <span className="header-nav-item">
            {context.currentNearNetwork.name}
          </span>
          <span className="header-nav-caret" />
        </Dropdown.Toggle>
        <Dropdown.Menu className="header-nav-item-dropdown-menu">
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
      </Dropdown>
    )}
  </NetworkConsumer>
);

export default HeaderDropdownNav;
