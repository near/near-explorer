import { Component } from "react";

import { Dropdown } from "react-bootstrap";

const HeaderDropdownItem = props => (
  <Dropdown.Item className="header-nav-item-dropdown" onClick={props.onClick}>
    {props.title}
  </Dropdown.Item>
);

class HeaderDropdownNav extends Component {
  constructor(props) {
    super(props);

    this.state = {
      network: "Testnet One"
    };

    this.selectNetwork = this.selectNetwork.bind(this);
  }

  selectNetwork(e) {
    this.setState({
      network: e.target.innerHTML
    });
  }

  render() {
    return (
      <Dropdown>
        <Dropdown.Toggle variant="dark" className="header-nav-network">
          <img src="/static/images/icon-nodes.svg" className="header-icon" />
          <span className="header-nav-item">{this.state.network}</span>
          <span className="header-nav-caret" />
        </Dropdown.Toggle>
        <Dropdown.Menu className="header-nav-item-dropdown-menu">
          <HeaderDropdownItem
            title="Testnet One"
            onClick={this.selectNetwork}
          />
          <HeaderDropdownItem
            title="Testnet Two"
            onClick={this.selectNetwork}
          />
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

export default HeaderDropdownNav;
