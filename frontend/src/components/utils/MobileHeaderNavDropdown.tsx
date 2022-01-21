import React, {
  FC,
  ReactNode,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import Link from "../utils/Link";

import IconAccounts from "../../../public/static/images/icon-accounts.svg";
import IconBlocks from "../../../public/static/images/icon-blocks.svg";
import IconNodes from "../../../public/static/images/icon-nodes.svg";
import IconStats from "../../../public/static/images/icon-stats.svg";
import IconTransactions from "../../../public/static/images/icon-transactions.svg";

import { useTranslation } from "react-i18next";
import LanguageToggle from "./LanguageToggle";
const languagesIcon = "/static/images/icon-languages.svg";
const downArrowIcon = "/static/images/icon-arrow-down.svg";

interface Props {
  link: string;
  icon: ReactNode;
  text: ReactNode;
}

const MobileNavItem: FC<Props> = ({ link, icon, text }) => {
  return (
    <Link href={link}>
      <a className="header-nav-item">
        {icon}
        <span className="nav-text">{text}</span>
        <style jsx global>{`
          .header-nav-link,
          .header-nav-link:hover {
            text-decoration: none;
          }

          .header-icon {
            width: 16px !important;
            margin-right: 3px;
          }

          .nav-text {
            letter-spacing: 1px;
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
            margin-left: 10px;
          }
          .header-nav-item {
            color: #a5a5a5;
            display: block;
            padding-top: 14px;
            padding-bottom: 14px;
            padding-left: 16px;
            width: 100%;
          }

          .header-nav-item:focus,
          .header-nav-item:active {
            background: #000000;
            color: #f8f8f8;
            fill: #a5a5a5;
          }
        `}</style>
      </a>
    </Link>
  );
};

const MobileNavDropdown = () => {
  const { t } = useTranslation();
  const [isMenuShown, setMenuShown] = useState(false);
  const dropdownWrapperRef = useRef<HTMLDivElement>(null);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);

  const showMenu = useCallback(
    (event: MouseEvent | React.MouseEvent<HTMLDivElement>) => {
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
  const closeMenu = useCallback(
    (event: MouseEvent | React.MouseEvent<HTMLDivElement>) => {
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

  useEffect(() => {
    if (isMenuShown) {
      document.addEventListener("click", closeMenu);
    } else {
      document.removeEventListener("click", closeMenu);
    }
    return () => document.removeEventListener("click", closeMenu);
  }, [isMenuShown, closeMenu]);

  return (
    <>
      <div
        className={`mobile ${isMenuShown ? "change" : ""}`}
        onClick={showMenu}
        ref={dropdownWrapperRef}
      >
        <div className="bar1"></div>
        <div className="bar2"></div>
        <div className="bar3"></div>

        {isMenuShown ? (
          <div ref={dropdownMenuRef} className="dropdown-content">
            <div className="mobile-nav">
              <Link href="/">
                <a style={{ color: "#F8F8F8", width: "100%" }}>
                  {t("component.utils.Header.home")}
                </a>
              </Link>
            </div>
            <div className="mobile-nav">
              {t("component.utils.HeaderNavDropdown.title")}
            </div>
            <MobileNavItem
              link="/accounts"
              icon={<IconAccounts className="header-icon" />}
              text={t("common.accounts.accounts")}
            />
            <MobileNavItem
              link="/blocks"
              icon={<IconBlocks className="header-icon" />}
              text={t("common.blocks.blocks")}
            />
            <MobileNavItem
              link="/transactions"
              icon={<IconTransactions className="header-icon" />}
              text={t("common.transactions.transactions")}
            />
            <MobileNavItem
              link="/nodes/validators"
              icon={<IconNodes className="header-icon" />}
              text={t("common.nodes.title")}
            />
            <MobileNavItem
              link="/stats"
              icon={<IconStats className="header-icon" />}
              text={t("common.stats.title_charts_and_stats")}
            />
            <div className="mobile-nav">
              <LanguageToggle />
            </div>
          </div>
        ) : null}
      </div>

      <style jsx global>{`
        .mobile {
          display: inline-block;
          cursor: pointer;
        }

        .bar1,
        .bar2,
        .bar3 {
          width: 18px;
          height: 2px;
          background-color: #000000;
          margin: 6px 0;
          transition: 0.4s;
        }

        /* Rotate first bar */
        .change .bar1 {
          -webkit-transform: rotate(-45deg) translate(-6px, 5px);
          transform: rotate(-45deg) translate(-6px, 5px);
        }

        /* Fade out the second bar */
        .change .bar2 {
          opacity: 0;
        }

        /* Rotate last bar */
        .change .bar3 {
          -webkit-transform: rotate(45deg) translate(-6px, -5px);
          transform: rotate(45deg) translate(-6px, -5px);
        }

        .dropdown-content {
          position: fixed;
          width: 100%;
          max-width: 100%;
          left: 0;
          top: 109px;
          z-index: 2;
          background: #25272a;
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
          text-align: left;
        }

        .mobile-nav {
          padding-top: 14px;
          padding-left: 16px;
          padding-bottom: 15px;
          color: #f8f8f8;
          letter-spacing: 1px;
        }

        .mobile-nav .lang-selector {
          appearance: none;
          background: url(${languagesIcon}) no-repeat 0px center / 24px 24px,
            url(${downArrowIcon}) no-repeat 95% / 16px;
          border: 0;
          color: #f8f8f8;
          cursor: pointer;
          height: 32px;
          outline: none;
          padding-right: 62px;
          position: relative;
          width: 100%;
          z-index: 1;
          text-indent: 32px;
        }
      `}</style>
    </>
  );
};

export default MobileNavDropdown;
