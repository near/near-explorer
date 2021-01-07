import { Container, Row, Col } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import HeaderNetworkDropdown from "./HeaderNetworkDropdown";
import HeaderNavDropdown from "./HeaderNavDropdown";
import MobileHeaderNavDropdown from "./MobileHeaderNavDropdown";
import Search from "./Search";
import NearLogo from "../../../public/static/images/near_logo.svg";

export default () => {
  const router = useRouter();
  const [isMobile, setMobile] = useState(false);
  useEffect(() => {
    setMobile(window.innerWidth < 760);
  });
  console.log(isMobile);
  return (
    <Container fluid className="header-container">
      <Row noGutters>
        <Col className="align-self-center" md="6" lg="2" xs="12">
          <Row>
            <Col xs="10" md="6" className="align-self-center">
              <Link href="/">
                <a>
                  <NearLogo className="near-main-logo" />
                </a>
              </Link>
            </Col>

            <Col md="6" className="align-self-center d-none d-md-block">
              <HeaderNetworkDropdown />
            </Col>

            <Col xs="2" className="align-self-center text-right d-md-none">
              <MobileHeaderNavDropdown />
            </Col>
          </Row>
        </Col>

        <Col className="align-self-center text-center" md="8" lg="8" xs="12">
          {router.pathname !== "/" ? <Search /> : isMobile ? <Search /> : null}
        </Col>

        <Col
          className="align-self-center text-right d-none d-md-block"
          md="4"
          lg="2"
        >
          <Row>
            <Col md="4" className="align-self-center">
              <Link href="/">
                <a className="header-home">Home</a>
              </Link>
            </Col>
            <Col md="8" className="align-self-center">
              <HeaderNavDropdown />
            </Col>
          </Row>
        </Col>
      </Row>
      <style jsx global>{`
        .header-container {
          padding: auto 5px;
          width: 100%;
          background: #ffffff;
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
          height: 72px;
        }

        .near-main-logo {
          width: 120px;
          height: 72px;
          padding: 6px;
        }

        .header-home {
          font-weight: 500;
          color: #000000;
        }

        @media (max-width: 991px) {
          .header-container {
            height: 111px;
          }
          .near-main-logo {
            height: 55px;
          }
        }
      `}</style>
    </Container>
  );
};
