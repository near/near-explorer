import { Row, Col, Spinner } from "react-bootstrap";
import BN from "bn.js";
import React from "react";

import { DatabaseConsumer } from "../../context/DatabaseProvider";
import LargeBalance from "../utils/LargeBalance";

export default () => {
  return (
    <DatabaseConsumer>
      {(context) => (
        <div className="vote">
          <Row
            style={{
              fontFamily: "BentonSans",
              color: "white",
              fontWeight: "400",
              margin: "15px 20px",
            }}
          >
            <span style={{ color: "#3FB4E7", marginRight: "5px" }}>
              Phase 2{" "}
            </span>{" "}
            Vote Status
          </Row>
          <Row style={{ textAlign: "left", margin: "auto", marginTop: "20px" }}>
            <Col style={{ marginTop: "-60px" }}>
              <div className="vote-needed">
                <p className="text-long">{"Votes needed for Phase II"}</p>
                <p className="text-short">{"Votes Needed"}</p>
                <p
                  style={{
                    color: "white",
                    fontWeight: "400",
                    fontSize: "0.7rem",
                  }}
                >
                  {context.phase2TotalStake !== "" ? (
                    <LargeBalance
                      amount={new BN(context.phase2TotalStake)
                        .mul(new BN(2))
                        .div(new BN(3))
                        .toString()}
                    />
                  ) : (
                    <Spinner animation="border" variant="secondary" />
                  )}
                </p>
              </div>
              <div className="vote-bar"></div>
              <div className="vote-pro">
                <div className="vote-bar-text">
                  {context.phase2TotalStake !== "" ? (
                    <div className="vote-data">
                      <strong>{`${
                        new BN(context.phase2TotalVotes)
                          .mul(new BN(10000))
                          .div(new BN(context.phase2TotalStake))
                          .toNumber() / 100
                      }%`}</strong>
                      (<LargeBalance amount={context.phase2TotalVotes} />)
                    </div>
                  ) : (
                    <Spinner animation="border" variant="secondary" />
                  )}
                </div>
              </div>
            </Col>
            <Col md="2">
              {"Total Stake"}
              <p
                style={{
                  color: "white",
                  fontWeight: "400",
                }}
              >
                {context.phase2TotalStake !== "" ? (
                  <LargeBalance amount={context.phase2TotalStake} />
                ) : (
                  <Spinner animation="border" variant="secondary" />
                )}
              </p>
            </Col>
          </Row>
          <style jsx global>{`
            @import url("https://fonts.googleapis.com/css2?family=Inter:wght@200;400;800&display=swap");

            .vote {
              color: #a0a0a2;
              background: #25272a;
              border-radius: 4px;
              font-size: 14px;
              margin-bottom: 63px;
              font-family: "Inter", sans-serif;
              font-weight: 200;
              padding: 15px 20px;
            }

            .vote-data {
              font-weight: 400;
              color: #853a10;
            }

            @media (max-width: 768px) {
              .vote-data {
                font-size: 0.5rem;
              }
            }

            .vote-bar {
              background: #0e0f10;
              height: 30px;
              width: 100%;
              text-align: center;
            }

            .vote-pro {
              position: relative;
              top: -30px;
              background: #f1cd96;
              box-shadow: 4px 0px 0px #e9721d;
              height: 30px;
              width: ${context.phase2TotalStake !== ""
                ? new BN(context.phase2TotalVotes)
                    .mul(new BN(10000))
                    .div(new BN(context.phase2TotalStake))
                    .toNumber() / 100
                : 0}%;
            }

            .vote-bar-text {
              position: relative;
              z-index: 10;
              text-align: right;
              padding: 5px;
            }

            .vote-needed {
              position: relative;
              height: 80px;
              border-left: 2px dashed #989898;
              margin-left: ${context.phase2TotalStake !== "" ? 200 / 3 : 0}%;
              top: 30px;
              padding-left: 5px;
            }

            .text-short {
              display: none;
            }

            .text-long {
              margin-bottom: 0;
            }

            @media (max-width: 768px) {
              .text-short {
                display: block;
                margin-bottom: 0;
                font-size: 8px;
              }
              .text-long {
                display: none;
              }
            }
          `}</style>
        </div>
      )}
    </DatabaseConsumer>
  );
};
