import * as React from "react";
import { Dropdown } from "react-bootstrap";
import { useAnalyticsTrack } from "../../hooks/analytics/use-analytics-track";

import { useNetworkContext } from "../../hooks/use-network-context";
import { NetworkName } from "../../types/common";
import { styled } from "../../libraries/styles";

const HeaderNetworkItemDropdown = styled(Dropdown.Item, {
  fontSize: 14,
  letterSpacing: 1.8,
  color: "#8d8d8d",
  padding: "6px 40px 6px 6px",
  borderRadius: 3,
  textTransform: "capitalize",

  "&:hover, &:active": {
    backgroundColor: "#e6e6e6",
  },
});

interface Props {
  link: string;
  title: NetworkName;
}

const HeaderDropdownItem: React.FC<Props> = React.memo(({ link, title }) => {
  const track = useAnalyticsTrack();

  return (
    <HeaderNetworkItemDropdown
      href={link}
      onClick={() =>
        track("Explorer Click to change network", { network: link })
      }
    >
      <NetworkIcon network={title} />
      {title}
    </HeaderNetworkItemDropdown>
  );
});

const HeaderNetwork = styled(Dropdown.Toggle, {
  background: "#ffffff",
  border: "2px solid #f1f1f1",
  boxSizing: "border-box",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
  borderRadius: 50,
  color: "#000000",
  textTransform: "capitalize",
  width: 154,
  height: 33,
  padding: "3px 2px",
  fontSize: 14,
  outline: "none",

  "&:hover, &:focus, &:active, &:focus:active, .show > &.dropdown-toggle": {
    background: "#f7f7f7 !important",
    color: "#000000 !important",
    boxShadow: "none !important",
    border: "0 solid #f1f1f1 !important",
  },
  "&.dropdown-toggle": {
    border: "2px solid #f1f1f1",
  },
  "&:focus": {
    boxShadow: "none",
  },
});

const HeaderNetworkDropdownMenu = styled(Dropdown.Menu, {
  background: "#ffffff",
  padding: 12,
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
  borderRadius: 8,
  border: "none",
  minWidth: 154,
});

const NetworkIcon = styled("div", {
  display: "inline-block",
  marginRight: 8,
  size: 8,
  borderRadius: "50%",

  variants: {
    network: {
      mainnet: {
        background: "#00c08b",
      },
      testnet: {
        background: "#e9b870",
      },
      guildnet: {
        background: "#0072ce",
      },
      localhostnet: {},
    },
  },
  defaultVariants: {
    network: "localhostnet",
  },
});

const DropdownArrow = styled("img", {
  marginLeft: 9,
});

const IconRight = styled("img", {
  size: 15,
  marginLeft: 16,
  marginTop: -3,
});

const HeaderNetworkDropdown: React.FC = React.memo(() => {
  const { networkName, networks } = useNetworkContext();
  return (
    <Dropdown>
      <HeaderNetwork variant="secondary">
        <NetworkIcon network={networkName} />
        {networkName}
        <IconRight src="/static/images/icon-network-right.svg" />
        <DropdownArrow src="/static/images/down-blue-arrow.svg" />
      </HeaderNetwork>
      <HeaderNetworkDropdownMenu>
        {networks.map(([name, network]) => {
          return (
            <HeaderDropdownItem
              key={name}
              title={name}
              link={network.explorerLink}
            />
          );
        })}
      </HeaderNetworkDropdownMenu>
    </Dropdown>
  );
});

export default HeaderNetworkDropdown;
