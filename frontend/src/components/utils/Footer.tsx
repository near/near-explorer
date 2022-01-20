import { FC } from "react";

import { Container, Row, Col } from "react-bootstrap";

import NearLogo from "../../../public/static/images/near_logo.svg";

import { useTranslation } from "react-i18next";
import { useAnalyticsTrack } from "../../hooks/analytics/use-analytics-track";

const Footer: FC = () => {
  const { t } = useTranslation();
  const track = useAnalyticsTrack();

  return (
    <Container fluid className="footer-container">
      <div className="nearlogo-wrapper">
        <Row noGutters>
          <Col className="align-self-center text-center px-0" xs="12" md="3">
            <NearLogo className="near-logo" />
          </Col>
          <Col
            className="align-self-center footer-link text-md-left text-center pl-0"
            xs="12"
            md="6"
          >
            &copy; {new Date().getFullYear()} NEAR Inc.{" "}
            {t("component.utils.Footer.all_rights_reserved")}.
            <br />
            <a
              className="footer-link-href"
              href="https://near.org/privacy/"
              target="_blank"
              rel="noopener"
              onClick={() => track("Explorer Click terms of service")}
            >
              {t("component.utils.Footer.terms_of_service")}
            </a>
            &nbsp;|&nbsp;
            <a
              className="footer-link-href"
              href="https://near.org/privacy/"
              target="_blank"
              rel="noopener"
              onClick={() => track("Explorer Click privacy policy")}
            >
              {t("component.utils.Footer.privacy_policy")}
            </a>
          </Col>
        </Row>
      </div>
      <div className="nearkat-wrapper">
        <a
          className="footer-help-link"
          href="http://near.chat"
          target="_blank"
          rel="noopener"
          onClick={() => track("Explorer Click join the community")}
        >
          <Row className="mx-0">
            <Col className="align-self-center footer-help">
              <span className="need-help-contact">
                {t("component.utils.Footer.questions")}?
              </span>
              <span className="need-help-contact need-help-contact-bottom">
                {t("component.utils.Footer.join_the_community")}
              </span>
            </Col>
          </Row>
        </a>
      </div>
      <style jsx global>{`
        .footer-container {
          background-color: #f8f8f8;
          font-size: 12px;
          line-height: 40px;
          color: #999999;
          height: 118px;
          display: flex;
          justify-content: space-between;
          flex-direction: row;
        }

        .footer-container > .col-12 {
          min-height: 70px;
          padding-top: 20px;
          padding-bottom: 25px;
        }

        .nearlogo-wrapper {
          padding: 30px;
          width: 70%;
          font-weight: normal;
        }

        .footer-link-href {
          color: #999999;
          text-decoration: underline;
        }

        .footer-link {
          line-height: 20px;
        }

        .footer-container .near-logo {
          height: 60px;
          fill: #acacac;
        }

        .footer-help {
          text-align: left;
          line-height: 24px;
          padding: 22px;
        }

        .need-help-contact {
          font-size: 18px;
          font-weight: 900;
          color: #999999;
          text-decoration: none !important;
        }

        .footer-help-link:hover {
          text-decoration: none !important;
        }

        .need-help-contact-bottom {
          color: #0072ce !important;
          display: block;
          font-weight: 600;
        }

        .near-logo {
          width: 100px;
        }

        .nearkat-wrapper {
          background: #ffffff;
          border: 1px solid #dadada;
          box-sizing: border-box;
          border-radius: 3px;
          height: 92px;
        }

        @media (max-width: 767.98px) {
          .footer-container {
            flex-direction: column-reverse;
            padding: 0;
            height: 92px;
            margin-top: 144px;
          }

          .nearlogo-wrapper {
            padding: 10px;
            width: 100%;
          }

          .footer-help {
            text-align: center;
          }

          .need-help-contact {
            font-size: 14px;
          }

          .nearkat-wrapper {
            border: none;
          }
        }
      `}</style>
    </Container>
  );
};

export default Footer;
