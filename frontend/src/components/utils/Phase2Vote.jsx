import { Row, Col, Spinner } from "react-bootstrap";
import BN from "bn.js";

import { DatabaseConsumer } from "../../context/DatabaseProvider";
import LargeBalance from "../utils/LargeBalance";

export default () => {
  return (
    <DatabaseConsumer>
      {(context) => (
        <div className="vote">
          <Row>
            <Col
              md="2"
              style={{
                fontFamily: "BentonSans",
                color: "white",
                fontWeight: "400",
              }}
            >
              Phase 2 Vote Status
            </Col>
            <Col
              style={{ borderLeft: "2px solid #505050", paddingLeft: "25px" }}
            >
              <Row>
                {"Total Stake:"}
                <span
                  style={{
                    color: "white",
                    fontWeight: "400",
                    marginLeft: "0.2rem",
                  }}
                >
                  {context.phase2TotalStake !== "" ? (
                    <LargeBalance amount={context.phase2TotalStake} />
                  ) : (
                    <Spinner animation="border" variant="secondary" />
                  )}
                </span>
              </Row>
              <Row>
                {"Votes Needed to Enable Phase 2:"}
                <span
                  style={{
                    color: "white",
                    fontWeight: "400",
                    marginLeft: "0.2rem",
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
                </span>
              </Row>
            </Col>
          </Row>
          <Row
            style={{ textAlign: "center", margin: "auto", marginTop: "20px" }}
          >
            <div className="vote-bar"></div>
            <div className="vote-pro"></div>
            {context.phase2TotalStake !== "" ? (
              <div className="vote-data">
                <span style={{ color: "#8DD4BD", fontWeight: "800" }}>
                  {" "}
                  {`${
                    new BN(context.phase2TotalVotes)
                      .mul(new BN(30000))
                      .div(new BN(context.phase2TotalStake))
                      .div(new BN(2))
                      .toNumber() / 100
                  }%`}
                </span>
                <span>
                  (<LargeBalance amount={context.phase2TotalVotes} />
                </span>
                {" / "}
                <LargeBalance
                  amount={new BN(context.phase2TotalStake)
                    .mul(new BN(2))
                    .div(new BN(3))
                    .toString()}
                />
                )
              </div>
            ) : (
              <Spinner animation="border" variant="secondary" />
            )}
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
              text-align: center;
              font-weight: 400;
              color: white;
              margin-top: 10px;
              position: relative;
              left: 60%;
            }

            @media (max-width: 950px) {
              .vote-data {
                left: 10%;
              }
            }

            .vote-bar {
              background: #000000;
              border-radius: 50px;
              height: 6px;
              width: 100%;
            }

            .vote-pro {
              position: relative;
              top: -6px;
              background: #8dd4bd;
              border-radius: 50px;
              height: 6px;
              width: ${context.phase2TotalStake !== ""
                ? new BN(context.phase2TotalVotes)
                    .mul(new BN(30000))
                    .div(new BN(context.phase2TotalStake))
                    .div(new BN(2))
                    .toNumber() / 100
                : 0}%;
            }
          `}</style>
        </div>
      )}
    </DatabaseConsumer>
  );
};
