import { Row, Col, Card } from "react-bootstrap";

export default props => (
  <Card className={`account-card ${props.cls || ""}`}>
    <Card.Body>
      <Row noGutters="true">
        <Col xs="auto" md="12" className="account-card-title align-self-center">
          {props.imgLink ? (
            <img src={props.imgLink} className="account-card-title-img" />
          ) : null}
          {props.title}
        </Col>
        <Col
          xs="auto"
          md="12"
          className="ml-auto account-card-text align-self-center"
        >
          {props.text}
        </Col>
      </Row>
    </Card.Body>
    <style jsx global>{`
      .account-card {
        border: solid 4px #e6e6e6;
        border-radius: 0;
      }

      .account-card-title {
        text-transform: uppercase;
        letter-spacing: 1.8px;
        color: #999999;
        font-family: BentonSans;
        font-size: 14px;
        font-weight: 500;
      }

      .account-card-title-img {
        width: 12px !important;
        margin-right: 8px;
        margin-top: -3px;
      }

      .account-card-text {
        font-family: BwSeidoRound;
        font-size: 24px;
        font-weight: 500;
        color: #24272a;
      }
    `}</style>
  </Card>
);
