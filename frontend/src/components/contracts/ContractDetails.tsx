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
      accessKeys: []
    }
  };

  getContractInfo = async () => {
    new ContractsApi()
      .getContractInfo(this.props.accountId)
      .then(contractInfo => {
        console.log(contractInfo);
      })
      .catch(err => console.error(err));
  };

  componentDidMount() {
    this.getContractInfo();
  }

  render() {
    return (
      <>
        <Row noGutters className="border-0">
          <Col md="5">
            <CardCell
              title="Created"
              text={
                typeof account.timestamp === "number"
                  ? moment(account.timestamp).format(
                      "MMMM DD, YYYY [at] h:mm:ssa"
                    )
                  : account.timestamp
              }
              className="block-card-created account-card-back border-0"
            />
          </Col>
          <Col md="7">
            <CardCell
              title="Creation Hash"
              text={
                account.address === "" ? (
                  ""
                ) : (
                  <TransactionLink transactionHash={account.address}>
                    {account.address}
                  </TransactionLink>
                )
              }
              className="block-card-created-text account-card-back border-0"
            />
          </Col>
        </Row>
      </>
    );
  }
}
