import Link from "next/link";

import { Row, Col } from "react-bootstrap";

import { DataConsumer } from "../utils/DataProvider";
import Search from "../utils/Search";

const BlocksHeader = props => (
  <div>
    <Row>
      <Col md="4" xs="6" className="ml-auto align-self-center">
        <Search text="Search blocks..." />
      </Col>
    </Row>
  </div>
);

export default BlocksHeader;
