import * as React from "react";

import { Col, Row } from "react-bootstrap";

import { styled } from "@/frontend/libraries/styles";

export const DashboardCardWrapper = styled(Row, {
  background: "#ffffff",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
  borderRadius: 8,
  padding: "3px 14px",

  "@media (max-width: 415px)": {
    boxShadow: "none",
    borderRadius: 0,
    width: "100%",
  },
});

const DashboardCardHeader = styled(Row, {
  fontWeight: 900,
  fontSize: 20,
  lineHeight: "22px",
  padding: "24px 10px",
  borderBottom: "2px solid #f1f1f1",
  "@media (max-width: 415px)": {
    padding: "17px 8px",
  },
});

const DashboardCardHeaderRight = styled(Col, {
  fontWeight: 500,
  fontSize: 14,
});

const DashboardIcon = styled("img", {
  width: "24px !important",
  marginRight: 8,
});

interface Props {
  className?: string;
  dataTestId: string;
  iconPath: string;
  title: string;
  headerRight?: React.ReactNode;
  children?: React.ReactNode;
}

export const DashboardCard: React.FC<Props> = React.memo(
  ({ iconPath, title, headerRight, className, dataTestId, children }) => (
    <DashboardCardWrapper
      noGutters
      className={className}
      data-testid={dataTestId}
    >
      <Col xs="12">
        <DashboardCardHeader>
          <Col>
            <DashboardIcon src={iconPath} />
            {title}
          </Col>
          <DashboardCardHeaderRight xs="auto">
            {headerRight}
          </DashboardCardHeaderRight>
        </DashboardCardHeader>
      </Col>
      <Col xs="12">{children}</Col>
    </DashboardCardWrapper>
  )
);
