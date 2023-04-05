import * as React from "react";

import Image from "next/image";
import { useTranslation } from "next-i18next";

import { BetaSwitch } from "@explorer/frontend/components/utils/BetaSwitch";
import LanguageToggle from "@explorer/frontend/components/utils/LanguageToggle";
import Link from "@explorer/frontend/components/utils/Link";
import { useBetaOptions } from "@explorer/frontend/hooks/use-beta-options";
import { useIsBetaPage } from "@explorer/frontend/hooks/use-is-beta-page";
import { styled } from "@explorer/frontend/libraries/styles";
import iconAccountsSvg from "@explorer/frontend/public/static/images/icon-accounts.svg";
import iconBlocksSvg from "@explorer/frontend/public/static/images/icon-blocks.svg";
import iconNodesSvg from "@explorer/frontend/public/static/images/icon-nodes.svg";
import iconStatsSvg from "@explorer/frontend/public/static/images/icon-stats.svg";
import iconTransactionsSvg from "@explorer/frontend/public/static/images/icon-transactions.svg";

const HeaderNavLink = styled(Link, {
  color: "#a5a5a5",
  display: "flex",
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
  iconSrc: string;
  text: React.ReactNode;
}

const MobileNavItem: React.FC<Props> = React.memo(({ link, iconSrc, text }) => (
  <HeaderNavLink href={link}>
    <Image src={iconSrc} width={16} height={16} />
    <NavText>{text}</NavText>
  </HeaderNavLink>
));

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

const LinkWrapper = styled(Link, {
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

  const [betaOptions] = useBetaOptions();
  const isBetaPage = useIsBetaPage();

  return (
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
            <LinkWrapper href="/">
              {t("component.utils.Header.home")}
            </LinkWrapper>
          </MobileNav>
          <MobileNav>{t("component.utils.HeaderNavDropdown.title")}</MobileNav>
          <MobileNavItem
            link="/accounts"
            iconSrc={iconAccountsSvg.src}
            text={t("common.accounts.accounts")}
          />
          <MobileNavItem
            link="/blocks"
            iconSrc={iconBlocksSvg.src}
            text={t("common.blocks.blocks")}
          />
          <MobileNavItem
            link="/transactions"
            iconSrc={iconTransactionsSvg.src}
            text={t("common.transactions.transactions")}
          />
          <MobileNavItem
            link="/nodes/validators"
            iconSrc={iconNodesSvg.src}
            text={t("common.nodes.title")}
          />
          <MobileNavItem
            link="/stats"
            iconSrc={iconStatsSvg.src}
            text={t("common.stats.title_charts_and_stats")}
          />
          <MobileNav>
            <LanguageToggle mobile />
          </MobileNav>
          {betaOptions && isBetaPage ? (
            <MobileNav>
              <BetaSwitch />
            </MobileNav>
          ) : null}
        </DropdownContent>
      ) : null}
    </MobileHeaderNav>
  );
});

export default MobileNavDropdown;
