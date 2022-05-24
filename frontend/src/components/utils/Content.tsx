import * as React from "react";

import { Container, Row, Col } from "react-bootstrap";
import { styled } from "../../libraries/styles";
import cx from "classnames";

const ContentContainer = styled(Container, {
  width: "100%",
});

export const ContentHeader = styled(Row, {
  padding: "2em 0.9375em 1em",
  marginHorizontal: 0,

  variants: {
    bordered: {
      true: {
        borderBottom: "4px solid #e5e5e5",
        marginBottom: "1em",
      },
    },
  },
});

export interface Props {
  title?: React.ReactNode;
  header?: React.ReactNode;
  overrideHeader?: React.FC<React.ComponentProps<typeof ContentHeader>>;
  border?: boolean;
  fluid?: boolean;
  contentFluid?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

const Content: React.FC<Props> = React.memo(
  ({
    border = true,
    icon,
    className,
    title,
    fluid,
    contentFluid,
    header,
    overrideHeader,
    children,
  }) => {
    const Header = overrideHeader || ContentHeader;
    return (
      <ContentContainer className={className} fluid={fluid}>
        {title ? (
          <Header bordered={border}>
            <Col className="px-0">
              <Row>
                {icon ? <Col xs="auto">{icon}</Col> : null}
                <Col
                  className={cx(
                    "text-md-left",
                    "text-center",
                    icon ? "px-0" : undefined
                  )}
                >
                  {title}
                </Col>
              </Row>
            </Col>
          </Header>
        ) : header ? (
          <Header bordered={border}>
            <Col className="px-0">{header}</Col>
          </Header>
        ) : null}

        <Container fluid={contentFluid}>{children}</Container>
      </ContentContainer>
    );
  }
);

export default Content;
