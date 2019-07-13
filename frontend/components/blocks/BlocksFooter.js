import Link from "next/link";

import { Row, Col } from "react-bootstrap";

import BlocksPageDisplaySelect from "./BlocksPageDisplaySelect";

const BlocksFooter = props => (
  <Row>
    <BlocksPageDisplaySelect rowCount="10" />
    <Col md="auto" xs="3" className="align-self-center">
      <span className="search-header-start">
        {props.start}-{props.stop}
      </span>
      <span className="search-header-total"> of {props.total} Total</span>
    </Col>
  </Row>
);

export default BlocksFooter;
