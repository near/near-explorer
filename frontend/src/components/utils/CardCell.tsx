import { Row, Col, Card } from "react-bootstrap";

export interface Props {
  className?: string;
  title: React.ReactElement | string;
  imgLink?: string;
  text: React.ReactElement | string;
}

export default ({ title, imgLink, text, className }: Props) => (
  <Card className={`card-cell ${className || ""}`}>
    <Card.Body>
      <Row noGutters>
        <Col xs="auto" md="12" className="card-cell-title align-self-center">
          {imgLink && <img src={imgLink} className="card-cell-title-img" />}
          {title}
        </Col>
        <Col
          xs="auto"
          md="12"
          className="ml-auto card-cell-text align-self-center"
        >
          {text}
        </Col>
      </Row>
    </Card.Body>
    <style jsx global>{`
      .card-cell {
        border-style: solid;
        border-color: #e6e6e6;
        border-width: 0 0 0 2px;
        border-radius: 0;
      }

      .card-cell-title {
        text-transform: uppercase;
        letter-spacing: 1.8px;
        color: #999999;
        font-family: BentonSans;
        font-size: 14px;
        font-weight: 500;
      }

      .card-cell-title-img {
        width: 12px !important;
        margin-right: 8px;
        margin-top: -3px;
      }

      .card-cell-text {
        font-family: BwSeidoRound;
        font-size: 18px;
        font-weight: 500;
        color: #24272a;
      }

      .card-cell a {
        font-weight: 500;
        color: #6ad1e3;
        text-decoration: none !important;
      }

      .card-cell a:hover {
        color: #6ad1e3;
      }
    `}</style>
  </Card>
);
