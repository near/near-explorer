import { Container, Row, Col } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";

import HeaderNetworkDropdown from "./HeaderNetworkDropdown";
import HeaderNavDropdown from "./HeaderNavDropdown";
import Search from "./Search";
import NearLogo from "../../../public/static/images/near_logo.svg";

export default () => {
  const router = useRouter();
  return (
    <Container fluid className="header-container">
      <Row noGutters>
        <Col xs="6" className="px-0 d-md-none align-self-center">
          <Link href="/">
            <a>
              <NearLogo className="near-main-logo" />
            </a>
          </Link>
        </Col>

        <Col md="1" className="d-none d-md-block">
          <Link href="/">
            <a>
              <NearLogo className="near-main-logo" />
            </a>
          </Link>
        </Col>

        <Col className="align-self-center pl-3" md="1" xs="6">
          <HeaderNetworkDropdown />
        </Col>

        <Col className="align-self-center text-center" md="8" xs="12">
          {router.pathname !== "/" && <Search />}
        </Col>

        <Col className="align-self-center text-center" md="2">
          <Row>
            <Col md="6" xs="6" className="pt-2">
              <Link href="/">
                <a className="header-home">Home</a>
              </Link>
            </Col>
            <Col md="6" xs="6" className="pt-1">
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
        }

        .near-main-logo {
          width: 100%;
          height: 72px;
          padding: 6px;
        }

        .header-home {
          font-weight: 500;
          color: #000000;
        }

        @media (max-width: 780px) {
          .near-main-logo {
            width: 100%;
          }
        }
      `}</style>
    </Container>
  );
};
