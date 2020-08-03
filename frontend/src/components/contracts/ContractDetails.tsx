import moment from "moment";

import React from "react";

import { Row, Col } from "react-bootstrap";

import ContractsApi from "../../libraries/explorer-wamp/contracts";

import CardCell from "../utils/CardCell";
import Term from "../utils/Term";
import TransactionLink from "../utils/TransactionLink";

interface Props {
  accountId: string;
}

interface State {
  locked?: boolean;
  transactionHash?: string;
  timestamp?: number;
  codeHash?: string;
}

export default class extends React.Component<Props, State> {
  state: State = {};

  collectContractInfo = async () => {
    new ContractsApi()
      .getContractInfo(this.props.accountId)
      .then((contractInfo) => {
        if (contractInfo) {
          this.setState({
            codeHash: contractInfo.codeHash,
            transactionHash: contractInfo.transactionHash,
            timestamp: contractInfo.timestamp,
            locked: contractInfo.accessKeys.every(
              (key: any) =>
                key["access_key"]["permission"]["FunctionCall"] !== undefined
            ),
          });
        }
        return;
      })
      .catch((err) => console.error(err));
  };

  componentDidMount() {
    this.collectContractInfo();
  }

  componentDidUpdate(preProps: Props) {
    if (this.props.accountId !== preProps.accountId) {
      this.collectContractInfo();
    }
  }

  render() {
    const { locked, transactionHash, timestamp, codeHash } = this.state;
    let lockedShow;
    if (locked !== undefined) {
      lockedShow = locked === true ? "Yes" : "No";
    }
    if (!codeHash) {
      return <></>;
    }
    return (
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
            <Col md="4">
              <CardCell
                title={
                  <Term title={"Last Updated"}>
                    {"Latest time the contract deployed. "}
                    <a
                      href={
                        "https://docs.nearprotocol.com/docs/roles/developer/quickstart"
                      }
                    >
                      docs
                    </a>
                  </Term>
                }
                text={
                  timestamp
                    ? moment(timestamp).format("MMMM DD, YYYY [at] h:mm:ssa")
                    : "N/A"
                }
                className="block-card-created-text border-0"
              />
            </Col>
            <Col md="8">
              <CardCell
                title={
                  <Term title={"Transaction Hash"}>
                    {
                      "The transaction unique identifier (hash) that the contract is latest deployed. "
                    }
                  </Term>
                }
                text={
                  transactionHash ? (
                    <TransactionLink transactionHash={transactionHash}>
                      {transactionHash}
                    </TransactionLink>
                  ) : (
                    "N/A"
                  )
                }
                className="block-card-created border-0"
              />
            </Col>
          </Row>
          <Row noGutters className="border-0">
            <Col md="4">
              <CardCell
                title={
                  <Term title={"Locked?"}>
                    {`Locked contract means that there are no access keys allowing the contract code to be re-deployed 
                (e.g. even a single FullAccess permission access key casts the locked status to "No"). However, the
                contract itself may still be implemented the way that it re-deploys itself or re-add FullAccess keys.`}
                  </Term>
                }
                text={lockedShow ? lockedShow : ""}
                className="block-card-created-text account-card-back border-0"
              />
            </Col>
            <Col md="8">
              <CardCell
                title={
                  <Term title={"Code Hash"}>
                    {
                      "Checksum (SHA-256 in base58 encoding) of the contract binary. "
                    }
                  </Term>
                }
                text={codeHash ? codeHash : ""}
                className="block-card-created account-card-back border-0"
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
            background: #f8f8f8;
          }
        `}</style>
      </>
    );
  }
}
