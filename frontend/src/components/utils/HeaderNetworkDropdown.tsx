import { FC } from "react";
import { Dropdown } from "react-bootstrap";
import { useAnalyticsTrack } from "../../hooks/analytics/use-analytics-track";

import { useNetworkContext } from "../../hooks/use-network-context";
import { NetworkName } from "../../libraries/config";
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

const HeaderDropdownItem: FC<Props> = ({ link, title }) => {
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
};

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
  width: 8,
  height: 8,
  borderRadius: "50%",
  background: "#0072ce",

  variants: {
    network: {
      mainnet: {
        background: "#00c08b",
      },
      testnet: {
        background: "#e9b870",
      },
      betanet: {
        background: "#00c1de",
      },
      localhostnet: {},
    },
  },
});

const DropdownArrow = styled("img", {
  marginLeft: 9,
});

const IconRight = styled("img", {
  height: 15,
  width: 15,
  marginLeft: 16,
  marginTop: -3,
});

const HeaderNetworkDropdown: FC = () => {
  const { currentNetwork, networks } = useNetworkContext();
  return (
    <Dropdown>
      <HeaderNetwork variant="secondary">
        <NetworkIcon network={currentNetwork.name} />
        {currentNetwork.name}
        <IconRight src="/static/images/icon-network-right.svg" />
        <DropdownArrow src="/static/images/down-blue-arrow.svg" />
      </HeaderNetwork>
      <HeaderNetworkDropdownMenu>
        {networks.map((network) => {
          return (
            <HeaderDropdownItem
              key={network.name}
              title={network.name}
              link={network.explorerLink}
            />
          );
        })}
      </HeaderNetworkDropdownMenu>
    </Dropdown>
  );
};

export default HeaderNetworkDropdown;
