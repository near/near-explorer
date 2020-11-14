import { Container, Row, Col } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";

import HeaderNetworkDropdown from "./HeaderNetworkDropdown";
import HeaderNavDropdown from "./HeaderNavDropdown";
import Search from "./Search";

export default () => {
  const router = useRouter();
  return (
    <Container fluid className="header-container">
      <Row noGutters>
        <Col xs="6" className="px-0 d-md-none align-self-center">
          <Link href="/">
            <a>
              <img
                className="near-main-logo"
                src="/static/images/near_logo.svg"
              />
            </a>
          </Link>
        </Col>

        <Col md="2" className="pl-0  d-none d-md-block">
          <Link href="/">
            <a>
              <img
                className="near-main-logo"
                src="/static/images/near_logo.svg"
              />
            </a>
          </Link>
        </Col>

        <Col className="align-self-center" md="2" xs="6">
          <HeaderNetworkDropdown />
        </Col>

        <Col className="align-self-center pl-1" md="6" xs="12">
          {router.pathname !== "/" && <Search />}
        </Col>

        <Col className="align-self-center text-right" md="2">
          <HeaderNavDropdown />
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
          height: 72px;
          padding: 6px;
        }

        .near-home {
          font-weight: 500;
          color: #000000;
          margin: auto;
        }

        @media (max-width: 780px) {
          .near-home {
            display: none;
            width: 0;
          }

          .near-main-logo {
            width: 100%;
          }
        }
      `}</style>
    </Container>
  );
};
