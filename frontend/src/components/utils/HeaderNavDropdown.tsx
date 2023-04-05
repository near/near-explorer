import * as React from "react";

import Image from "next/image";
import { useTranslation } from "next-i18next";
import { Dropdown } from "react-bootstrap";

import Link from "@explorer/frontend/components/utils/Link";
import { globalCss, styled } from "@explorer/frontend/libraries/styles";
import iconAccounts from "@explorer/frontend/public/static/images/icon-accounts.svg";
import iconBlocks from "@explorer/frontend/public/static/images/icon-blocks.svg";
import iconNodes from "@explorer/frontend/public/static/images/icon-nodes.svg";
import iconStats from "@explorer/frontend/public/static/images/icon-stats.svg";
import iconTransactions from "@explorer/frontend/public/static/images/icon-transactions.svg";

const HeaderNavLink = styled(Link, {
  display: "flex",
  color: "#a5a5a5",
  paddingTop: 10,
  paddingBottom: 15,
  paddingLeft: 18,
  width: "100%",
  height: "100%",

  "&:hover": {
    background: "#000000",
    color: "white",
  },
});

const NavText = styled("span", {
  letterSpacing: 2,
  textDecoration: "none",
  fontSize: 14,
  fontWeight: 500,
  marginLeft: 10,
});

interface Props {
  link: string;
  iconSrc: string;
  text: React.ReactNode;
}

const HeaderNavItem: React.FC<Props> = React.memo(({ link, iconSrc, text }) => (
  <HeaderNavLink href={link}>
    <Image src={iconSrc} width={16} height={16} />
    <NavText>{text}</NavText>
  </HeaderNavLink>
));

const ChainHeader = styled(Dropdown.Toggle, {
  color: "#000000",
  background: "#ffffff",
  border: "none",
  fontWeight: 500,
  width: "100%",

  "&:hover, &:focus, &:active, .show > &.dropdown-toggle": {
    background: "#ffffff !important",
    color: "#000000 !important",
    border: "none",
  },

  "&:focus": {
    boxShadow: "none",
  },
});

const HeaderDropdownMenu = styled(Dropdown.Menu, {
  background: "#25272a",
  borderRadius: 8,
  width: 267,
});

const DropdownArrow = styled("img", {
  marginLeft: 9,
});

const globalStyles = globalCss({
  ".dropdown-toggle::after": {
    content: "none",
  },

  [`.show > .dropdown-toggle > ${DropdownArrow}`]: {
    transform: "rotate(180deg)",
  },

  ".show > .btn-primary.dropdown-toggle:focus": {
    boxShadow: "none",
  },
});

const HeaderNavDropdown: React.FC = React.memo(() => {
  const { t } = useTranslation();
  globalStyles();
  return (
    <Dropdown>
      <ChainHeader>
        {t("component.utils.HeaderNavDropdown.title")}
        <DropdownArrow src="/static/images/down-arrow.svg" />
      </ChainHeader>
      <HeaderDropdownMenu>
        <HeaderNavItem
          link="/accounts"
          iconSrc={iconAccounts.src}
          text={t("common.accounts.accounts")}
        />
        <HeaderNavItem
          link="/blocks"
          iconSrc={iconBlocks.src}
          text={t("common.blocks.blocks")}
        />
        <HeaderNavItem
          link="/transactions"
          iconSrc={iconTransactions.src}
          text={t("common.transactions.transactions")}
        />
        <HeaderNavItem
          link="/nodes/validators"
          iconSrc={iconNodes.src}
          text={t("common.nodes.title")}
        />
        <HeaderNavItem
          link="/stats"
          iconSrc={iconStats.src}
          text={t("common.stats.title_charts_and_stats")}
        />
      </HeaderDropdownMenu>
    </Dropdown>
  );
});

export default HeaderNavDropdown;
