import React from "react";
import Link from "next/link";

import IconAccounts from "../../../public/static/images/icon-accounts.svg";
import IconBlocks from "../../../public/static/images/icon-blocks.svg";
import IconNodes from "../../../public/static/images/icon-nodes.svg";
import IconStats from "../../../public/static/images/icon-stats.svg";
import IconTransactions from "../../../public/static/images/icon-transactions.svg";

const MobileNavItem = ({ link, icon, text }) => {
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

export default class extends React.Component {
  state = { showMenu: false };

  showMenu = (event) => {
    event.preventDefault();
    this.setState({ showMenu: true }, () => {
      document.addEventListener("click", this.closeMenu);
    });
  };

  closeMenu = (event) => {
    if (!this.dropdownMenu.contains(event.target)) {
      this.setState({ showMenu: false }, () => {
        document.removeEventListener("click", this.closeMenu);
      });
    }
  };
  render() {
    return (
      <>
        <div
          className={`mobile ${this.state.showMenu ? "change" : ""}`}
          onClick={this.showMenu}
        >
          <div className="bar1"></div>
          <div className="bar2"></div>
          <div className="bar3"></div>

          {this.state.showMenu ? (
            <div
              ref={(element) => {
                this.dropdownMenu = element;
              }}
              className="dropdown-content"
            >
              <div className="mobile-nav">
                <Link href="/">
                  <a style={{ color: "#F8F8F8", width: "100%" }}>Home</a>
                </Link>
              </div>
              <div className="mobile-nav">Explore</div>
              <MobileNavItem
                link="/accounts"
                icon={<IconAccounts className="header-icon" />}
                text="Accounts"
              />
              <MobileNavItem
                link="/blocks"
                icon={<IconBlocks className="header-icon" />}
                text="Blocks"
              />
              <MobileNavItem
                link="/transactions"
                icon={<IconTransactions className="header-icon" />}
                text="Transactions"
              />
              <MobileNavItem
                link="/nodes/validators"
                icon={<IconNodes className="header-icon" />}
                text="Nodes"
              />
              <MobileNavItem
                link="/stats"
                icon={<IconStats className="header-icon" />}
                text="Charts & Stats"
              />
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
        `}</style>
      </>
    );
  }
}
