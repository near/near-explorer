import { Row, Col } from "react-bootstrap";

const ERow = () => (
  <Row>
    <Col>&nbsp;</Col>
  </Row>
);

const renderRows = count => {
  count = count === undefined ? 1 : parseInt(count);

  const rows = [];
  for (let i = 0; i < count; ++i) {
    rows.push(<ERow key={i} />);
  }
  return rows;
};

const EmptyRow = props => <div>{renderRows(props.rows)}</div>;

export default EmptyRow;
