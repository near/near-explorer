import * as React from "react";
import Link from "../utils/Link";

import IconAccountsSvg from "../../../public/static/images/icon-accounts.svg";
import IconBlocksSvg from "../../../public/static/images/icon-blocks.svg";
import IconNodesSvg from "../../../public/static/images/icon-nodes.svg";
import IconStatsSvg from "../../../public/static/images/icon-stats.svg";
import IconTransactionsSvg from "../../../public/static/images/icon-transactions.svg";

import { useTranslation } from "react-i18next";
import LanguageToggle from "./LanguageToggle";
import { styled } from "../../libraries/styles";
import { StyledComponent } from "@stitches/react/types/styled-component";

const Icon = styled("svg", {
  width: 16,
  marginRight: 3,
});

const HeaderNavLink = styled("a", {
  color: "#a5a5a5",
  display: "block",
  paddingVertical: 14,
  paddingLeft: 16,
  width: "100%",

  "&:focus, &:active": {
    background: "#000000",
    color: "#f8f8f8",
    fill: "#a5a5a5",
  },
});

const NavText = styled("span", {
  letterSpacing: 1,
  textDecoration: "none",
  fontSize: 14,
  fontWeight: 500,
  marginLeft: 10,
});

interface Props {
  link: string;
  IconElement: StyledComponent;
  text: React.ReactNode;
}

const MobileNavItem: React.FC<Props> = React.memo(
  ({ link, IconElement, text }) => {
    return (
      <Link href={link} passHref>
        <HeaderNavLink>
          <Icon as={IconElement} />
          <NavText>{text}</NavText>
        </HeaderNavLink>
      </Link>
    );
  }
);

const MobileHeaderNav = styled("div", {
  display: "inline-block",
  cursor: "pointer",
});

const Bar = styled("div", {
  width: 18,
  height: 2,
  backgroundColor: "#000000",
  margin: "6px 0",
  transition: "0.4s",

  variants: {
    order: {
      1: {
        ".change &": {
          transform: "rotate(-45deg) translate(-6px, 5px)",
        },
      },
      2: {
        ".change &": {
          opacity: 0,
        },
      },
      3: {
        ".change &": {
          transform: "rotate(45deg) translate(-6px, -5px)",
        },
      },
    },
  },
});

const MobileNav = styled("div", {
  paddingVertical: 14,
  paddingLeft: 16,
  color: "#f8f8f8",
  letterSpacing: 1,
});

const DropdownContent = styled("div", {
  position: "fixed",
  width: "100%",
  maxWidth: "100%",
  left: 0,
  top: 109,
  zIndex: 2,
  background: "#25272a",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
  textAlign: "left",
});

const LinkWrapper = styled("a", {
  color: "#F8F8F8",
  width: "100%",
});

const MobileNavDropdown: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const [isMenuShown, setMenuShown] = React.useState(false);
  const dropdownWrapperRef = React.useRef<HTMLDivElement>(null);
  const dropdownMenuRef = React.useRef<HTMLDivElement>(null);

  const showMenu = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      const dropdownMenuElement = dropdownMenuRef.current;
      const dropdownWrapperElement = dropdownWrapperRef.current;
      if (!dropdownWrapperElement) {
        return;
      }
      setMenuShown(
        !dropdownWrapperElement.contains(dropdownMenuElement) ||
          Boolean(dropdownMenuElement?.contains(event.target as Node))
      );
    },
    []
  );
  const closeMenu = React.useCallback(
    (event: MouseEvent) => {
      const dropdownMenuElement = dropdownMenuRef.current;
      if (
        dropdownMenuElement &&
        !dropdownMenuElement.contains(event.target as Node)
      ) {
        setMenuShown(false);
      }
    },
    [dropdownMenuRef]
  );

  React.useEffect(() => {
    if (isMenuShown) {
      document.addEventListener("click", closeMenu);
    }
    return () => document.removeEventListener("click", closeMenu);
  }, [isMenuShown, closeMenu]);

  return (
    <>
      <MobileHeaderNav
        className={isMenuShown ? "change" : undefined}
        onClick={showMenu}
        ref={dropdownWrapperRef}
      >
        <Bar order={1} />
        <Bar order={2} />
        <Bar order={3} />

        {isMenuShown ? (
          <DropdownContent ref={dropdownMenuRef}>
            <MobileNav>
              <Link href="/" passHref>
                <LinkWrapper>{t("component.utils.Header.home")}</LinkWrapper>
              </Link>
            </MobileNav>
            <MobileNav>
              {t("component.utils.HeaderNavDropdown.title")}
            </MobileNav>
            <MobileNavItem
              link="/accounts"
              IconElement={IconAccountsSvg}
              text={t("common.accounts.accounts")}
            />
            <MobileNavItem
              link="/blocks"
              IconElement={IconBlocksSvg}
              text={t("common.blocks.blocks")}
            />
            <MobileNavItem
              link="/transactions"
              IconElement={IconTransactionsSvg}
              text={t("common.transactions.transactions")}
            />
            <MobileNavItem
              link="/nodes/validators"
              IconElement={IconNodesSvg}
              text={t("common.nodes.title")}
            />
            <MobileNavItem
              link="/stats"
              IconElement={IconStatsSvg}
              text={t("common.stats.title_charts_and_stats")}
            />
            <MobileNav>
              <LanguageToggle mobile />
            </MobileNav>
          </DropdownContent>
        ) : null}
      </MobileHeaderNav>
    </>
  );
});

export default MobileNavDropdown;
