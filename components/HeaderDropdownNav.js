import { Component } from "react";

import { Dropdown } from "react-bootstrap";

import { DataConsumer } from "./utils/DataProvider";

const HeaderDropdownItem = props => (
  <Dropdown.Item className="header-nav-item-dropdown" onClick={props.onClick}>
    {props.title}
  </Dropdown.Item>
);

const HeaderDropdownNav = () => (
  <DataConsumer>
    {context => (
      <Dropdown>
        <Dropdown.Toggle variant="dark" className="header-nav-network">
          <img src="/static/images/icon-nodes.svg" className="header-icon" />
          <span className="header-nav-item">{context.currentNetwork}</span>
          <span className="header-nav-caret" />
        </Dropdown.Toggle>
        <Dropdown.Menu className="header-nav-item-dropdown-menu">
          {context.networks.map((network, index) => {
            return (
              <HeaderDropdownItem
                key={index}
                title={network}
                onClick={() => context.updateNetwork(network)}
              />
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
    )}
  </DataConsumer>
);

export default HeaderDropdownNav;
