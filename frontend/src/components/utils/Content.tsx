import { Component } from "react";

import { Container, Row, Col } from "react-bootstrap";

export interface Props {
  title?: React.ReactNode;
  header?: React.ReactNode;
  size?: "big" | "medium";
  border?: boolean;
  fluid?: boolean;
  contentFluid?: boolean;
  icon?: React.ReactNode;
  className: string;
  children: React.ReactNode;
}

class Content extends Component<Props> {
  static defaultProps = {
    size: "big",
    border: true,
    className: "",
    fluid: false,
    contentFluid: false,
  };

  render() {
    const {
      size,
      border,
      icon,
      className,
      title,
      fluid,
      contentFluid,
      header,
    } = this.props;

    return (
      <Container
        className={`content-container content-${size} ${className}`}
        fluid={fluid}
      >
        {title ? (
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
                  {title}
                </Col>
              </Row>
            </Col>
          </Row>
        ) : header ? (
          <Row className={`content-header ${border ? "with-border" : ""}`}>
            <Col className="px-0">{header}</Col>
          </Row>
        ) : null}

        <Container fluid={contentFluid}>{this.props.children}</Container>

        <style jsx global>{`
          .content-container {
            width: 100%;
          }

          .content-header {
            padding: 2em 0.9375em 1em;
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

export default Content;
