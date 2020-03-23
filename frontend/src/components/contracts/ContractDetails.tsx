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
      transactionHash: "",
      timestamp: 0,
      accessKeys: [],
    },
  };

  getContractInfo = async () => {
    new ContractsApi()
      .getContractInfo(this.props.accountId)
      .then((contractInfo) => {
        console.log(contractInfo);
      })
      .catch((err) => console.error(err));
  };

  componentDidMount() {
    this.getContractInfo();
  }

  render() {
    const { contractInfo } = this.state;
    return (
      <>
        <Row noGutters className="border-0">
          <Col md="6">
            <CardCell
              title="Code Hash"
              text={
                <TransactionLink transactionHash={contractInfo.transactionHash}>
                  {contractInfo.transactionHash}
                </TransactionLink>
              }
              className="block-card-created account-card-back border-0"
            />
          </Col>
          <Col md="4">
            <CardCell
              title="Last Updated"
              text={moment(contractInfo.timestamp).format(
                "MMMM DD, YYYY [at] h:mm:ssa"
              )}
              className="block-card-created-text account-card-back border-0"
            />
          </Col>
          <Col md="2">
            <CardCell
              title="Status"
              text={"Locked"}
              className="block-card-created-text account-card-back border-0"
            />
          </Col>
        </Row>
      </>
    );
  }
}
