import * as React from "react";

import { useTranslation } from "next-i18next";
import { Container, Row, Col } from "react-bootstrap";

import { useAnalyticsTrack } from "@/frontend/hooks/analytics/use-analytics-track";
import { styled } from "@/frontend/libraries/styles";
import NearSvg from "@/frontend/public/static/images/near_logo.svg";

const FooterContainer = styled(Container, {
  backgroundColor: "#f8f8f8",
  fontSize: 12,
  lineHeight: "40px",
  color: "#999999",
  display: "flex",
  justifyContent: "space-between",
  flexDirection: "row",
  marginTop: "auto",

  "& > .col-12": {
    paddingTop: 20,
    paddingBottom: 25,
  },

  "@media (max-width: 767.98px)": {
    flexDirection: "column-reverse",
    padding: 0,
    height: "auto",
  },
});

const NearLogo = styled(NearSvg, {
  width: 100,
  height: 60,
  fill: "#acacac",

  "@media (max-width: 767.98px)": {
    padding: 10,
    width: "100%",
  },
});

const NearLogoWrapper = styled("div", {
  padding: 30,
  width: "70%",
  fontWeight: "normal",
});

const FooterLinkHref = styled("a", {
  color: "#999999",
  textDecoration: "underline",
});

const FooterLink = styled(Col, {
  lineHeight: "20px",
});

const FooterHelp = styled(Col, {
  textAlign: "left",
  lineHeight: "24px",
  padding: 22,
  "@media (max-width: 767.98px)": {
    textAlign: "center",
  },
});

const FooterHelpLink = styled("a", {
  "&:hover": {
    textDecoration: "none !important",
  },
});

const NeedHelpContact = styled("span", {
  fontSize: 18,
  fontWeight: 900,
  color: "#999999",
  textDecoration: "none !important",

  "@media (max-width: 767.98px)": {
    fontSize: 14,
  },

  variants: {
    bottom: {
      true: {
        color: "#0072ce",
        display: "block",
        fontWeight: 600,
      },
    },
  },
});

const NearkatWrapper = styled("div", {
  background: "#ffffff",
  border: "1px solid #dadada",
  boxSizing: "border-box",
  borderRadius: 3,
  height: 92,

  "@media (max-width: 767.98px)": {
    border: "none",
  },
});

const Footer: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const track = useAnalyticsTrack();

  return (
    <FooterContainer fluid>
      <NearLogoWrapper>
        <Row noGutters>
          <Col className="align-self-center text-center px-0" xs="12" md="3">
            <NearLogo />
          </Col>
          <FooterLink
            className="align-self-center text-md-left text-center pl-0"
            xs="12"
            md="6"
          >
            &copy; {new Date().getFullYear()} NEAR Inc.{" "}
            {t("component.utils.Footer.all_rights_reserved")}.
            <br />
            <FooterLinkHref
              href="https://near.org/privacy/"
              target="_blank"
              rel="noopener"
              onClick={() => track("Explorer Click terms of service")}
            >
              {t("component.utils.Footer.terms_of_service")}
            </FooterLinkHref>
            &nbsp;|&nbsp;
            <FooterLinkHref
              href="https://near.org/privacy/"
              target="_blank"
              rel="noopener"
              onClick={() => track("Explorer Click privacy policy")}
            >
              {t("component.utils.Footer.privacy_policy")}
            </FooterLinkHref>
          </FooterLink>
        </Row>
      </NearLogoWrapper>
      <NearkatWrapper>
        <FooterHelpLink
          href="http://near.chat"
          target="_blank"
          rel="noopener"
          onClick={() => track("Explorer Click join the community")}
        >
          <Row className="mx-0">
            <FooterHelp className="align-self-center">
              <NeedHelpContact>
                {t("component.utils.Footer.questions")}?
              </NeedHelpContact>
              <NeedHelpContact bottom>
                {t("component.utils.Footer.join_the_community")}
              </NeedHelpContact>
            </FooterHelp>
          </Row>
        </FooterHelpLink>
      </NearkatWrapper>
    </FooterContainer>
  );
});

export default Footer;
