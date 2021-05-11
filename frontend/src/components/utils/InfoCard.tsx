import React from "react";

import { Col, Row, Spinner } from "react-bootstrap";

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

const InfoCard = ({ children, className = undefined }: InfoCardProps) => (
  <Row noGutters className={`info-card ${className}`}>
    {children}
    <style global jsx>{`
      .info-card {
        background: #ffffff;
        border: 1px solid #f0f0f1;
        box-shadow: 0px 2px 2px rgba(17, 22, 24, 0.04);
        border-radius: 8px;
        padding: 48px 32px;
      }
    `}</style>
  </Row>
);

const InfoCardCell = ({
  children,
  className = undefined,
  title,
  cellOptions = undefined,
}: InfoCardCellProps) => (
  <Col {...cellOptions} className={`info-card-cell ${className}`}>
    <Row noGutters>
      <Col xs="12" className="info-card-title">
        {title}
      </Col>
      <Col xs="12" className="info-card-text">
        {!children ? <Spinner animation="border" size="sm" /> : children}
      </Col>
    </Row>
    <style global jsx>{`
      .info-card-title {
        color: #a2a2a8;
        font-weight: 500;
        font-size: 14px;
        line-height: 17px;
        margin: 8px 0;
      }
      .info-card-text {
        font-weight: 900;
        font-size: 31px;
        line-height: 130%;
        color: #272729;
        font-feature-settings: "zero", on;
      }
    `}</style>
  </Col>
);

export { InfoCard, InfoCardCell };
