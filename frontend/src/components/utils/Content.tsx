import React from "react";

import { Container, Row, Col } from "react-bootstrap";

export interface Props {
  title: React.ReactNode;
  size?: "big" | "medium";
  border?: boolean;
  icon?: React.ReactNode;
  className: string;
  children: React.ReactNode;
}

export default class extends React.Component<Props> {
  static defaultProps = {
    size: "big",
    border: true,
    className: "",
  };

  render() {
    const { size, border, icon, className } = this.props;

    return (
      <Container
        className={`content-container content-${size} near-main-container ${className}`}
        fluid
      >
        <Row className={`content-header ${border ? "with-border" : ""}`}>
          <Col className="px-0">
            <Row>
              {icon ? (
                <Col xs="auto" className="content-icon-col">
                  {icon}
                </Col>
              ) : null}
              <Col
                className={`${
                  icon ? "px-0" : ""
                } content-title text-md-left text-center`}
              >
                {this.props.title}
              </Col>
            </Row>
          </Col>
        </Row>
        {this.props.children}
        <style jsx global>{`
          .content-header {
            padding: 2em 0 1em;
            margin-left: 0;
            margin-right: 0;
          }

          .content-header.with-border {
            border-bottom: 4px solid #e5e5e5;
            margin-bottom: 1em;
          }

          .content-title-total {
            color: rgba(0, 0, 0, 0.4);
          }

          .content-big .content-title-total {
            font-size: 50px;
          }

          .content-medium .content-title-total {
            font-size: 26px;
          }

          .content-title-margin {
            border-top: 4px solid rgba(0, 0, 0, 0.1);
          }
        `}</style>
      </Container>
    );
  }
}
