import { FC } from "react";
import { Badge, Col, Row } from "react-bootstrap";

import { NetworkStatsConsumer } from "../../context/NetworkStatsProvider";

import Link from "../utils/Link";

import { useTranslation } from "react-i18next";

interface Props {
  role: string;
}

const NodeNav: FC<Props> = ({ role }) => {
  const { t } = useTranslation();
  return (
    <NetworkStatsConsumer>
      {(context) => (
        <>
          <Row>
            <Col
              xs="auto"
              className={`node-selector pt-2 pb-2 ${
                role === "validators" ? `node-selected` : ""
              }`}
            >
              <Link href="/nodes/validators">
                <a className="node-link" id="validator-node">
                  {t("component.nodes.NodeNav.validating")}{" "}
                  <Badge pill className="nodes-amount-label validating">
                    {context.networkStats
                      ? context.networkStats.currentValidatorsCount
                      : "--"}
                  </Badge>
                </a>
              </Link>
            </Col>
          </Row>
          <style jsx global>{`
            .node-selector {
              height: 100%;
              font-size: 16px;
              font-weight: 500;
              text-decoration: none;
              padding-left: 0;
              padding-right: 0;
              margin-left: 16px;
              margin-top: 2px;
              text-align: center;
              color: #72727a;
              transition: all 0.15s ease-in-out;
            }

            .node-selector:hover {
              color: #111618;
            }

            .nodes-amount-label {
              border-radius: 50px;
              line-height: 150%;
              font-weight: 500;
            }

            .nodes-amount-label.validating {
              background-color: #00c08b;
              color: #ffffff;
            }

            .nodes-amount-label.online {
              background-color: #e5e5e6;
              color: #72727a;
            }

            .nodes-amount-label.proposed {
              background-color: #ffecd6;
              color: #995200;
            }

            .node-link,
            .node-link:hover {
              color: inherit;
            }

            .node-selected {
              color: #111618;
              border-bottom: 2px solid #2b9af4;
            }

            .node-icon {
              margin: 10px;
            }
          `}</style>
        </>
      )}
    </NetworkStatsConsumer>
  );
};

export default NodeNav;
