import { Container, Row, Col } from "react-bootstrap";
import { useRouter } from "next/router";

import HeaderNetworkDropdown from "./HeaderNetworkDropdown";
import HeaderNavDropdown from "./HeaderNavDropdown";
import MobileHeaderNavDropdown from "./MobileHeaderNavDropdown";
import Search from "./Search";
import Link from "./Link";

import NearLogo from "../../../public/static/images/near_logo.svg";
import NearLogoIcon from "../../../public/static/images/near_logo_icon.svg";

import { Translate } from "react-localize-redux";
import LanguageToggle from "../utils/LangSwitcher";
const languagesIcon = "/static/images/icon-languages.svg";
const downArrowIcon = "/static/images/down-arrow.svg";

const Header = () => {
  const router = useRouter();

  return (
    <Container fluid className="header-container">
      <Row noGutters>
        <Col xs="12" md="auto" className="align-self-center">
          <Row noGutters className="header-main-bar">
            <Col md="6" className="d-none d-md-block d-lg-block">
              <Link href="/">
                <a>
                  <NearLogo className="near-main-logo" />
                </a>
              </Link>
            </Col>

            <Col xs="2" className="d-md-none text-left">
              <Link href="/">
                <a>
                  <NearLogoIcon className="near-main-mobile-logo" />
                </a>
              </Link>
            </Col>

            <Col xs="8" md="2" className="align-self-center text-center">
              <HeaderNetworkDropdown />
            </Col>

            <Col
              xs="2"
              className="align-self-center text-right mobile-nav-bar d-md-none"
            >
              <MobileHeaderNavDropdown />
            </Col>
          </Row>
        </Col>

        <Col
          className="align-self-center text-center search-box-column d-md-none"
          xs="12"
        >
          <Search />
        </Col>

        <Col className="align-self-center text-center search-box-column d-none d-md-block d-lg-block ">
          {router.pathname !== "/" && <Search />}
        </Col>

        <Col
          className="header-secondary-bar align-self-center text-right d-none d-md-block"
          md="auto"
        >
          <Row>
            <Col md="4" className="align-self-center">
              <LanguageToggle />
            </Col>
            <Col md="3" className="align-self-center">
              <Link href="/">
                <a className="header-home">
                  <Translate id="component.utils.Header.home" />
                </a>
              </Link>
            </Col>
            <Col md="5" className="align-self-center">
              <HeaderNavDropdown />
            </Col>
          </Row>
        </Col>
      </Row>
      <style jsx global>{`
        .header-container {
          background: #ffffff;
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
        }

        .near-main-logo {
          width: 120px;
          height: 72px;
          padding: 6px;
        }

        .near-main-mobile-logo {
          width: 48px;
        }

        .header-main-bar {
          padding: 3px 16px 4px 6px;
        }

        .header-container .mobile-nav-bar .mobile {
          margin: 8px 0 0 0;
        }

        .search-box-column > .search-box {
          padding: 0 16px;
        }

        .header-home,
        .header-home:hover {
          font-weight: 500;
          color: #000000;
          text-decoration: none;
        }

        @media (max-width: 768px) {
          .header-container {
            padding: 0 0 14px 0;
          }
        }

        .lang-selector {
          appearance: none;
          background: url(${languagesIcon}) no-repeat 10px center / 20px 20px,
            url(${downArrowIcon}) no-repeat 85% 12px / 10px;
          border: 0;
          cursor: pointer;
          font-size: 16px;
          height: 32px;
          outline: none;
          padding-right: 54px;
          position: relative;
          user-select: none;
          width: 54px;
          z-index: 1;
        }

        .lang-selector::-ms-expand {
          display: none;
        }
      `}</style>
    </Container>
  );
};

export default Header;
