import { Container, Row, Col } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";

import HeaderNetworkDropdown from "./HeaderNetworkDropdown";
import HeaderNavDropdown from "./HeaderNavDropdown";
import MobileHeaderNavDropdown from "./MobileHeaderNavDropdown";
import Search from "./Search";
import NearLogo from "../../../public/static/images/near_logo.svg";

export default () => {
  const router = useRouter();

  return (
    <Container fluid className="header-container">
      <Row noGutters>
        <Col className="align-self-center" md="6" lg="2" xs="12" sm="12">
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

        <Col className="align-self-center text-center d-md-none" sm="12">
          <Search />
        </Col>

        <Col
          className="align-self-center text-center d-none d-md-block d-lg-block "
          md="8"
          lg="8"
        >
          {router.pathname !== "/" && <Search />}
        </Col>

        <Col
          className="align-self-center text-right d-none d-md-block"
          md="4"
          lg="2"
        >
          <Row>
            <Col md="5" className="align-self-center">
              <Link href="/">
                <a className="header-home">Home</a>
              </Link>
            </Col>
            <Col md="7" className="align-self-center">
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
