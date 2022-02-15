import React from "react";

import { Col, Row, Spinner } from "react-bootstrap";
import { styled } from "../../libraries/styles";

const InfoCardWrapper = styled(Row, {
  background: "#ffffff",
  border: "1px solid #f0f0f1",
  boxShadow: "0px 2px 2px rgba(17, 22, 24, 0.04)",
  borderRadius: 8,
  padding: "48px 32px",
});

interface InfoCardProps {
  children: React.ReactNode;
  className?: string;
}
interface InfoCardCellProps {
  children: React.ReactNode;
  className?: string;
  title: string | React.ReactNode;
  cellOptions?: object;
}

const InfoCard: React.FC<InfoCardProps> = ({ children, className }) => (
  <InfoCardWrapper noGutters className={className}>
    {children}
  </InfoCardWrapper>
);

const InfoCardTitle = styled(Col, {
  color: "#a2a2a8",
  fontWeight: 500,
  fontSize: 14,
  lineHeight: "17px",
  margin: "8px 0",
});

export const InfoCardText = styled(Col, {
  fontWeight: 900,
  fontSize: 31,
  lineHeight: 1.3,
  color: "#272729",
  fontFeatureSettings: '"zero", on',
});

const InfoCardCell = ({
  children,
  className,
  title,
  cellOptions = undefined,
}: InfoCardCellProps) => (
  <Col {...cellOptions} className={className}>
    <Row noGutters>
      <InfoCardTitle xs="12">{title}</InfoCardTitle>
      <InfoCardText xs="12">
        {!children ? <Spinner animation="border" size="sm" /> : children}
      </InfoCardText>
    </Row>
  </Col>
);

export { InfoCard, InfoCardCell };
