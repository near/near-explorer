import Link from "next/link";

import { Row, Col } from "react-bootstrap";

import Pagination from "../utils/Pagination";

const BlocksFooter = props => (
  <Row>
    <Pagination />
  </Row>
);

export default BlocksFooter;
