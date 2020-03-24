import moment from "moment";

import React from "react";

import { Row, Col } from "react-bootstrap";

import ContractsApi, * as C from "../../libraries/explorer-wamp/contracts";

import CardCell from "../utils/CardCell";
import TransactionLink from "../utils/TransactionLink";

interface Props {
  accountId: string;
}

interface State {
  display: boolean;
  locked: boolean;
  contractInfo: C.ContractInfo;
}

export default class extends React.Component<Props, State> {
  state: State = {
    display: false,
    locked: true,
    contractInfo: {
      id: "",
      transactionHash: null,
      timestamp: null,
      accessKeys: [],
    },
  };

  getContractInfo = async () => {
    new ContractsApi()
      .getContractInfo(this.props.accountId)
      .then((contractInfo) => {
        if (contractInfo.transactionHash !== null) {
          contractInfo.accessKeys.map((key: any) => {
            const permission = key["access_key"]["permission"];
            if (permission === "FullAccess") {
              this.setState({ locked: false });
            }
            return;
          });
          this.setState({
            display: true,
            contractInfo: {
              id: contractInfo.id,
              transactionHash: contractInfo.transactionHash,
              timestamp: contractInfo.timestamp,
              accessKeys: contractInfo.accessKeys,
            },
          });
        }
      })
      .catch((err) => console.error(err));
  };

  componentDidMount() {
    this.getContractInfo();
  }

  componentDidUpdate(preProps: Props) {
    if (this.props.accountId !== preProps.accountId) {
      this.setState({ display: false });
      this.getContractInfo();
    }
  }
  render() {
    const { display, locked, contractInfo } = this.state;
    return (
      display && (
        <>
          <Row noGutters className="border-0">
            <Col md="6">
              <CardCell
                title="Code Hash"
                text={
                  contractInfo.transactionHash !== null ? (
                    <TransactionLink
                      transactionHash={contractInfo.transactionHash}
                    >
                      {contractInfo.transactionHash}
                    </TransactionLink>
                  ) : (
                    ""
                  )
                }
                className="block-card-created account-card-back border-0"
              />
            </Col>
            <Col md="4">
              <CardCell
                title="Last Updated"
                text={
                  contractInfo.timestamp !== null
                    ? moment(contractInfo.timestamp).format(
                        "MMMM DD, YYYY [at] h:mm:ssa"
                      )
                    : ""
                }
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
        </>
      )
    );
  }
}
