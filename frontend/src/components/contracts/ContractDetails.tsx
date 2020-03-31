import moment from "moment";

import React from "react";

import { Row, Col } from "react-bootstrap";

import ContractsApi from "../../libraries/explorer-wamp/contracts";

import CardCell from "../utils/CardCell";
import TransactionLink from "../utils/TransactionLink";

interface Props {
  accountId: string;
}

interface State {
  locked?: boolean;
  transactionHash?: string;
  timestamp?: number;
}

export default class extends React.Component<Props, State> {
  state: State = {
    locked: true
  };

  getContractInfo = async () => {
    new ContractsApi()
      .getContractInfo(this.props.accountId)
      .then(contractInfo => {
        if (contractInfo) {
          this.setState({
            transactionHash: contractInfo.transactionHash,
            timestamp: contractInfo.timestamp,
            locked: contractInfo.accessKeys.every(
              (key: any) =>
                key["access_key"]["permissions"]["FunctionCall"] !== undefined
            )
          });
        }
        return;
      })
      .catch(err => console.error(err));
  };

  componentDidMount() {
    this.getContractInfo();
  }

  componentDidUpdate(preProps: Props) {
    if (this.props.accountId !== preProps.accountId) {
      this.getContractInfo();
    }
  }
  render() {
    const { locked, transactionHash, timestamp } = this.state;
    return (
      transactionHash && (
        <>
          <div className="contract-title">
            <img
              src={"/static/images/icon-d-contract.svg"}
              className="card-cell-title-img"
            />
            CONTRACT
          </div>
          <div className="contract-info-container">
            <Row noGutters className="border-0">
              <Col md="6">
                <CardCell
                  title="Code Hash"
                  text={
                    <TransactionLink transactionHash={transactionHash}>
                      {transactionHash}
                    </TransactionLink>
                  }
                  className="block-card-created account-card-back border-0"
                />
              </Col>
              <Col md="4">
                <CardCell
                  title="Last Updated"
                  text={moment(timestamp).format("MMMM DD, YYYY [at] h:mm:ssa")}
                  className="block-card-created-text account-card-back border-0"
                />
              </Col>
              <Col md="2">
                <CardCell
                  title="Status"
                  text={locked ? "Locked" : "Unlocked"}
                  className="block-card-created-text account-card-back border-0"
                />
              </Col>
            </Row>
          </div>
          <style jsx global>{`
            .contract-title {
              position: relative;
              z-index: 1;
              padding: 8px;
              width: 140px;
              top: 16px;
              margin-top: 32px;
              margin-left: 50px;
              background: #ffffff;
              border: 2px solid #e6e6e6;
              box-sizing: border-box;
              border-radius: 25px;
              font-family: BentonSans;
              font-size: 14px;
              line-height: 16px;
              color: #999999;
              font-weight: 100;
              letter-spacing: 1.75px;
              text-transform: uppercase;
            }

            .contract-info-container {
              border: solid 4px #e6e6e6;
              border-radius: 4px;
              margin: 0 15px;
            }
          `}</style>
        </>
      )
    );
  }
}
