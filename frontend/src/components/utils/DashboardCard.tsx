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
  <Row noGutters className={`dashboard-card ${className || ""}`}>
    <Col xs="12">
      <Row className="dashboard-card-header">
        <Col>
          <img src={iconPath} className="dashboard-icon" />
          {title}
        </Col>
        <Col xs="auto" className="dashboard-card-header-right">
          {headerRight}
        </Col>
      </Row>
    </Col>
    <Col xs="12">{children}</Col>
    <style jsx global>{`
      .dashboard-card {
        background: #ffffff;
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
        border-radius: 8px;
        padding: 3px 14px;
      }

      .dashboard-card-header {
        font-weight: 900;
        font-size: 20px;
        line-height: 22px;
        padding: 24px 10px;
        border-bottom: 2px solid #f1f1f1;
      }

      .dashboard-card-header-right {
        font-weight: 500;
        font-size: 14px;
      }

      .dashboard-icon {
        width: 24px !important;
        margin-right: 8px;
      }

      @media (max-width: 415px) {
        .dashboard-card {
          box-shadow: none;
          border-radius: 0;
          width: 100%;
        }

        .dashboard-card-header {
          padding: 17px 8px;
        }
      }
    `}</style>
  </Row>
);
