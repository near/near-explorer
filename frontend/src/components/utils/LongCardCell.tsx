import { Row, Col, Spinner } from "react-bootstrap";

export interface Props {
  title: React.ReactElement | string;
  text: React.ReactElement | string;
  loading?: boolean;
}

export default ({ title, text, loading }: Props) => (
  <Row className="long-card-cell" noGutters>
    <Col xs="auto" md="12" className="long-card-cell-title align-self-center">
      {title}
    </Col>
    <Col xs="auto" md="12" className="ml-auto card-cell-text align-self-center">
      {loading ? <Spinner animation="border" variant="secondary" /> : text}
    </Col>
    <style jsx global>{`
      .long-card-cell {
        width: 330px;
        height: 100px;
        padding: 6px;
        margin-left: 12px;
      }

      .card-cell-text:hover {
        background: #f9f9f9;
        border-radius: 8px;
        cursor: pointer;
      }

      .long-card-cell-title {
        color: #9b9b9b;
        font-size: 14px;
        font-weight: 500;
      }

      .card-cell-text {
        font-weight: 900;
        font-size: 31px;
        line-height: 38px;
      }

      .card-cell .term-helper .info {
        display: none;
      }
      .card-cell:hover .term-helper .info {
        display: block;
      }

      @media (max-width: 800px) {
        .card-cell .term-helper .info {
          display: block;
        }
      }
    `}</style>
  </Row>
);
