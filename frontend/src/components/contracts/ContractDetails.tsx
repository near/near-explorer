import moment from "moment";

import { Component } from "react";

import { Row, Col } from "react-bootstrap";

import ContractsApi from "../../libraries/explorer-wamp/contracts";

import CardCell from "../utils/CardCell";
import Term from "../utils/Term";
import TransactionLink from "../utils/TransactionLink";

import { Translate } from "react-localize-redux";

interface Props {
  accountId: string;
}

interface State {
  locked?: boolean;
  transactionHash?: string;
  timestamp?: number;
  codeHash?: string;
}

class ContractDetails extends Component<Props, State> {
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
    let lockedShow: string | JSX.Element;
    if (locked !== undefined) {
      lockedShow =
        locked === true ? (
          <Translate id="common.state.yes" />
        ) : (
          <Translate id="common.state.no" />
        );
    }
    if (!codeHash) {
      return <></>;
    }
    return (
      <Translate>
        {({ translate }) => (
          <>
            <div className="contract-title">
              <img
                src={"/static/images/icon-d-contract.svg"}
                className="card-cell-title-img"
              />
              <Translate id="common.contracts.contract" />
            </div>
            <div className="contract-info-container">
              <Row noGutters className="border-0">
                <Col md="4">
                  <CardCell
                    title={
                      <Term
                        title={translate(
                          "component.contracts.ContractDetails.last_updated.title"
                        )}
                        text={translate(
                          "component.contracts.ContractDetails.last_updated.text"
                        )}
                        href={
                          "https://docs.near.org/docs/develop/basics/getting-started"
                        }
                      />
                    }
                    text={
                      timestamp
                        ? moment(timestamp).format(
                            translate(
                              "common.date_time.date_time_format"
                            ).toString()
                          )
                        : translate("common.state.not_available").toString()
                    }
                    className="block-card-created-text border-0"
                  />
                </Col>
                <Col md="8">
                  <CardCell
                    title={
                      <Term
                        title={translate(
                          "component.contracts.ContractDetails.transaction_hash.title"
                        )}
                        text={translate(
                          "component.contracts.ContractDetails.transaction_hash.text"
                        )}
                      />
                    }
                    text={
                      transactionHash ? (
                        <TransactionLink transactionHash={transactionHash}>
                          {transactionHash}
                        </TransactionLink>
                      ) : (
                        translate("common.state.not_available").toString()
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
                      <Term
                        title={translate(
                          "component.contracts.ContractDetails.locked.title"
                        )}
                        text={translate(
                          "component.contracts.ContractDetails.locked.text",
                          undefined,
                          { renderInnerHtml: true }
                        )}
                      />
                    }
                    text={lockedShow ? lockedShow : ""}
                    className="block-card-created-text account-card-back border-0"
                  />
                </Col>
                <Col md="8">
                  <CardCell
                    title={
                      <Term
                        title={translate(
                          "component.contracts.ContractDetails.code_hash.title"
                        )}
                        text={translate(
                          "component.contracts.ContractDetails.code_hash.text"
                        )}
                      />
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
                font-size: 14px;
                line-height: 16px;
                color: #999999;
                font-weight: 500;
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
        )}
      </Translate>
    );
  }
}

export default ContractDetails;
