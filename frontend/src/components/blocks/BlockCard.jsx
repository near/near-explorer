import Link from "next/link";

import { Row, Col, Card } from "react-bootstrap";

export default props => (
  <Card
    className={props.cls}
    style={{ border: "solid 4px #e6e6e6", borderRadius: "0" }}
  >
    <Card.Body>
      <Row noGutters="true">
        <Col xs="auto" md="12" className="block-card-title align-self-center">
          {props.imgLink !== undefined ? (
            <img src={props.imgLink} className="block-card-title-img" />
          ) : null}
          {props.title}
        </Col>
        <Col
          xs="auto"
          md="12"
          className={`ml-auto block-card-text align-self-center ${
            props.textCls !== undefined ? props.textCls : ""
          }`}
        >
          {props.textLink === true ? (
            <Link href={`/blocks/${props.text}`}>
              <a className={props.textCls}>
                {props.format !== undefined
                  ? parseInt(props.text).toLocaleString()
                  : props.text}
              </a>
            </Link>
          ) : props.format !== undefined ? (
            parseInt(props.text).toLocaleString()
          ) : (
            props.text
          )}
        </Col>
      </Row>
    </Card.Body>
    <style jsx global>{`
      .block-card-title {
        text-transform: uppercase;
        letter-spacing: 1.8px;
        color: #999999;
        font-family: BentonSans;
        font-size: 14px;
        font-weight: 500;
      }

      .block-card-title-img {
        width: 12px !important;
        margin-right: 8px;
        margin-top: -3px;
      }

      .block-card-text {
        font-family: BwSeidoRound;
        font-size: 24px;
        font-weight: 500;
        color: #24272a;
      }
    `}</style>
  </Card>
);
