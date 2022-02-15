import { FC } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useRouter } from "next/router";

import HeaderNetworkDropdown from "./HeaderNetworkDropdown";
import HeaderNavDropdown from "./HeaderNavDropdown";
import MobileHeaderNavDropdown from "./MobileHeaderNavDropdown";
import Search from "./Search";
import Link from "./Link";

import NearLogoSvg from "../../../public/static/images/near_logo.svg";
import NearMiniLogoSvg from "../../../public/static/images/near_logo_icon.svg";

import { useTranslation } from "react-i18next";
import LanguageToggle from "./LanguageToggle";
import { styled } from "../../libraries/styles";

const HeaderContainer = styled(Container, {
  background: "#ffffff",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",

  "@media (max-width: 768px)": {
    padding: "0 0 14px 0",
  },
});

const MobileNavBarWrapper = styled(Col, {
  paddingTop: 8,
});

const NearLogo = styled(NearLogoSvg, {
  width: 120,
  height: 72,
  padding: 6,
});

const NearMiniLogo = styled(NearMiniLogoSvg, {
  width: 48,
});

const HeaderMainBar = styled(Row, {
  padding: "3px 16px 4px 6px",
});

const SearchBoxColumn = styled(Col, {
  margin: "0 16px",
});

const HeaderHome = styled("a", {
  fontWeight: 500,
  color: "#000000",
  textDecoration: "none",
});

const Header: FC = () => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <HeaderContainer fluid>
      <Row noGutters>
        <Col xs="12" md="auto" className="align-self-center">
          <HeaderMainBar noGutters>
            <Col md="6" className="d-none d-md-block d-lg-block">
              <Link href="/">
                <a>
                  <NearLogo />
                </a>
              </Link>
            </Col>

            <Col xs="2" className="d-md-none text-left">
              <Link href="/">
                <a>
                  <NearMiniLogo />
                </a>
              </Link>
            </Col>

            <Col xs="8" md="2" className="align-self-center text-center">
              <HeaderNetworkDropdown />
            </Col>

            <MobileNavBarWrapper
              xs="2"
              className="align-self-center text-right d-md-none"
            >
              <MobileHeaderNavDropdown />
            </MobileNavBarWrapper>
          </HeaderMainBar>
        </Col>

        <SearchBoxColumn
          className="align-self-center text-center d-md-none"
          xs="12"
        >
          <Search />
        </SearchBoxColumn>

        <SearchBoxColumn className="align-self-center text-center d-none d-md-block d-lg-block ">
          {router.pathname !== "/" && <Search />}
        </SearchBoxColumn>

        <Col
          className="align-self-center text-right d-none d-md-block"
          md="auto"
        >
          <Row>
            <Col md="3" className="align-self-center">
              <LanguageToggle />
            </Col>
            <Col md="4" className="align-self-center">
              <Link href="/" passHref>
                <HeaderHome>{t("component.utils.Header.home")}</HeaderHome>
              </Link>
            </Col>
            <Col md="5" className="align-self-center">
              <HeaderNavDropdown />
            </Col>
          </Row>
        </Col>
      </Row>
    </HeaderContainer>
  );
};

export default Header;
