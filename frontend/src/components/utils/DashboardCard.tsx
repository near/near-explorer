import React from "react";
import { Col, Row } from "react-bootstrap";

interface Props {
  className?: string;
  iconPath: string;
  title: string;
  headerRight?: React.ReactNode;
  children?: React.ReactNode;
}

export default ({
  className,
  iconPath,
  title,
  headerRight,
  children,
}: Props) => (
  <Row className={`dashboard-card ${className || ""}`} noGutters>
    <Col xs="12">
      <Row className="dashboard-card-header">
        <Col>
          <img src={iconPath} className="dashboard-icon" />
          {title}
        </Col>
        <Col xs="auto">{headerRight}</Col>
      </Row>
    </Col>
    <Col xs="12">{children}</Col>
    <style jsx global>{`
      .dashboard-card {
        background: #ffffff;
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
        border-radius: 8px;
        padding: 3px 24px;
      }

      .dashboard-card-header {
        font-weight: 800;
        font-size: 18px;
        line-height: 22px;
        padding: 24px 10px;
        margin-bottom: 6px;
        border-bottom: 2px solid #f1f1f1;
      }

      .dashboard-icon {
        width: 24px !important;
        margin-right: 8px;
      }

      @media (max-width: 415px) {
        .dashboard-card {
          border-radius: 0;
          margin-top: 16px;
          width: 100%;
        }

        .dashboard-card-header {
          padding: 17px 30px;
        }
      }
    `}</style>
  </Row>
);
