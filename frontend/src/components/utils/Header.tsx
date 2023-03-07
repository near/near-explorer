import * as React from "react";

import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { Container, Row, Col } from "react-bootstrap";

import { BetaSwitch } from "@explorer/frontend/components/utils/BetaSwitch";
import HeaderNavDropdown from "@explorer/frontend/components/utils/HeaderNavDropdown";
import HeaderNetworkDropdown from "@explorer/frontend/components/utils/HeaderNetworkDropdown";
import LanguageToggle from "@explorer/frontend/components/utils/LanguageToggle";
import Link from "@explorer/frontend/components/utils/Link";
import MobileHeaderNavDropdown from "@explorer/frontend/components/utils/MobileHeaderNavDropdown";
import Search from "@explorer/frontend/components/utils/Search";
import { ServiceStatusView } from "@explorer/frontend/components/utils/ServiceStatus";
import { useBetaOptions } from "@explorer/frontend/hooks/use-beta-options";
import { useIsBetaPage } from "@explorer/frontend/hooks/use-is-beta-page";
import { useNetworkContext } from "@explorer/frontend/hooks/use-network-context";
import { styled } from "@explorer/frontend/libraries/styles";
import NearLogoSvg from "@explorer/frontend/public/static/images/near_logo.svg";
import NearMiniLogoSvg from "@explorer/frontend/public/static/images/near_logo_icon.svg";

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

const CenteredCol = styled(Col, {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const SearchBoxColumn = styled(Col, {
  margin: "0 16px",
});

const HeaderHome = styled(Link, {
  fontWeight: 500,
});

const Header: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const router = useRouter();
  const { network } = useNetworkContext();
  const [betaOptions] = useBetaOptions();
  const isBetaPage = useIsBetaPage();
  const shouldShowSwitch = Boolean(betaOptions) && isBetaPage;

  return (
    <HeaderContainer fluid>
      <Row noGutters>
        <Col xs="12" md="auto" className="align-self-center">
          <HeaderMainBar noGutters>
            <Col md="6" className="d-none d-md-block d-lg-block">
              <Link href="/">
                <NearLogo />
              </Link>
            </Col>

            <Col xs="2" className="d-md-none text-left">
              <Link href="/">
                <NearMiniLogo />
              </Link>
            </Col>

            {network?.offline ? null : (
              <CenteredCol md="2" xs="1">
                <ServiceStatusView />
              </CenteredCol>
            )}

            <Col xs="7" md="2" className="align-self-center text-center">
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
            {shouldShowSwitch ? (
              <Col md="3" className="align-self-center">
                <BetaSwitch />
              </Col>
            ) : null}
            <Col md={shouldShowSwitch ? 2 : 3} className="align-self-center">
              <LanguageToggle />
            </Col>
            <Col md={shouldShowSwitch ? 3 : 4} className="align-self-center">
              <HeaderHome href="/">
                {t("component.utils.Header.home")}
              </HeaderHome>
            </Col>
            <Col md={shouldShowSwitch ? 4 : 5} className="align-self-center">
              <HeaderNavDropdown />
            </Col>
          </Row>
        </Col>
      </Row>
    </HeaderContainer>
  );
});

export default Header;
