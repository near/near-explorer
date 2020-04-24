import { Row, Col, Card, Spinner } from "react-bootstrap";
import React from "react";

interface Props {
  className?: string;
  title: string | React.ReactElement;
  imgLink?: string;
  text: React.ReactElement | string;
  loading?: boolean;
}

interface State {
  modalInfo?: string;
}

export default class extends React.Component<Props, State> {
  state: State = {};

  changeModalHandler = (name: string) => {
    this.setState({ modalInfo: name });
  };

  ModalCloseHander = () => {
    this.setState({ modalInfo: undefined });
  };

  render() {
    const { className, title, imgLink, text, loading } = this.props;
    return (
      <Card className={`card-cell ${className || ""}`}>
        <Card.Body>
          <Row noGutters>
            <Col
              xs="auto"
              md="12"
              className="card-cell-title align-self-center"
            >
              {imgLink && <img src={imgLink} className="card-cell-title-img" />}
              {title}
            </Col>
            <Col
              xs="auto"
              md="12"
              className="ml-auto card-cell-text align-self-center"
            >
              {loading ? (
                <Spinner animation="border" variant="secondary" />
              ) : (
                text
              )}
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
        `}</style>
      </Card>
    );
  }
}
