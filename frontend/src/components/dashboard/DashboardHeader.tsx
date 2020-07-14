import Link from "next/link";
import Router from "next/router";

import React from "react";
import { Button, Col, FormControl, InputGroup, Row } from "react-bootstrap";

import AccountsApi from "../../libraries/explorer-wamp/accounts";
import BlocksApi from "../../libraries/explorer-wamp/blocks";
import TransactionsApi from "../../libraries/explorer-wamp/transactions";
import DetailsApi, * as D from "../../libraries/explorer-wamp/details";

import CardCell from "../utils/CardCell";
import Term from "../utils/Term";

interface State {
  details?: D.Details;
  searchValue: string;
  loading: boolean;
}

export default class extends React.Component<State> {
  constructor(props: any) {
    super(props);
    this.timer = null;
  }

  timer: ReturnType<typeof setTimeout> | null;

  state: State = {
    searchValue: "",
    loading: true,
  };

  handleSearch = async (event: any) => {
    event.preventDefault();

    const { searchValue } = this.state;

    const blockPromise = new BlocksApi()
      .getBlockInfo(searchValue)
      .catch(() => {});

    const transactionPromise = new TransactionsApi()
      .getTransactionInfo(searchValue)
      .catch(() => {});
    const accountPromise = new AccountsApi()
      .queryAccount(searchValue)
      .catch(() => {});

    const block = await blockPromise;
    if (block) {
      return Router.push("/blocks/" + block.hash);
    }
    const transaction = await transactionPromise;
    if (transaction && transaction.signerId) {
      return Router.push("/transactions/" + searchValue);
    }
    if (await accountPromise) {
      return Router.push("/accounts/" + searchValue);
    }

    alert("Result not found!");
  };

  handleSearchValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event) {
      const value = event.target !== null ? event.target.value : "";
      this.setState({ searchValue: value });
    }
  };

  componentDidMount() {
    this.timer = setTimeout(this.regularFetchInfo, 0);
  }

  componentWillUnmount() {
    const timer = this.timer;
    this.timer = null;
    if (timer !== null) {
      clearTimeout(timer);
    }
  }

  fetchInfo = async () => {
    new DetailsApi()
      .getDetails()
      .then((details) => {
        if (details !== undefined) {
          this.setState({ details, loading: false });
        }
      })
      .catch((err) => console.error(err));
  };

  regularFetchInfo = async () => {
    await this.fetchInfo();
    if (this.timer !== null) {
      this.timer = setTimeout(this.regularFetchInfo, 10000);
    }
  };

  changeModalHandler = (name: string) => {
    this.setState({ modalInfo: name });
  };

  ModalCloseHander = () => {
    this.setState({ modalInfo: undefined });
  };

  render() {
    const { details, loading } = this.state;
    return (
      <div className="dashboard-info-container">
        <Row noGutters>
          <Col xs="12" md="3">
            <CardCell
              title={
                <Term title={"Nodes Online"}>
                  {
                    "Total number of validating nodes / Total number of online nodes. "
                  }
                  <a
                    href={
                      "https://docs.nearprotocol.com/docs/roles/integrator/faq#validators"
                    }
                  >
                    docs
                  </a>
                </Term>
              }
              imgLink="/static/images/icon-m-node-online.svg"
              text={
                details ? (
                  <Link href="/nodes/[role]" as={`/nodes/validators`}>
                    <a id="node-page" className="dashboard-link">
                      {details.validatorsCount.toLocaleString()}/
                      {details.onlineNodesCount.toLocaleString()}
                    </a>
                  </Link>
                ) : (
                  ""
                )
              }
              className="border-0"
              loading={loading}
            />
          </Col>
          <Col xs="12" md="3">
            <CardCell
              title={
                <Term title={"Block Height"}>
                  <p>{`The most recent block height recorded to the blockchain.`}</p>
                  <p>{`The block height is a sequential number of the most recent block in the blockchain.`}</p>
                  <p>{`For example, a block height of 1000 indicates that up to 1001 blocks may exist in the blockchain (genesis + blocks 0-1000).
                    In NEAR, there is not guaranteed to be a block for each sequential number, e.g. block 982 does not necessarily exist.`}</p>
                  <p>
                    <a href="https://docs.near.org/docs/concepts/overview">
                      {"Learn more about the key concepts"}
                    </a>
                  </p>
                </Term>
              }
              imgLink="/static/images/icon-m-height.svg"
              text={details ? details.lastBlockHeight.toLocaleString() : ""}
              loading={loading}
            />
          </Col>
          <Col xs="12" md="2">
            <CardCell
              title={
                <Term title={"TXs"}>
                  {"The number of transactions since genesis. "}
                  <a
                    href={
                      "https://docs.nearprotocol.com/docs/concepts/transaction"
                    }
                  >
                    docs
                  </a>
                </Term>
              }
              imgLink="/static/images/icon-m-transaction.svg"
              text={details ? details.totalTxCount.toLocaleString() : ""}
              loading={loading}
            />
          </Col>
          <Col xs="12" md="2">
            <CardCell
              title={
                <Term title={"TPD"}>
                  {"The number of transactions in the last 24 hours. "}
                  <a
                    href={
                      "https://docs.nearprotocol.com/docs/concepts/transaction"
                    }
                  >
                    docs
                  </a>
                </Term>
              }
              imgLink="/static/images/icon-m-transaction.svg"
              text={details ? details.lastDayTxCount.toLocaleString() : ""}
              loading={loading}
            />
          </Col>
          <Col xs="12" md="2">
            <CardCell
              title={
                <Term title={"Accounts"}>
                  {"Total number of accounts created on this net. "}
                  <a
                    href={"https://docs.nearprotocol.com/docs/concepts/account"}
                  >
                    docs
                  </a>
                </Term>
              }
              imgLink="/static/images/icon-m-user.svg"
              text={
                details ? (
                  <Link href="/accounts">
                    <a className="dashboard-link">
                      {details.accountsCount.toLocaleString()}
                    </a>
                  </Link>
                ) : (
                  ""
                )
              }
              loading={loading}
            />
          </Col>
        </Row>
        <form onSubmit={this.handleSearch}>
          <Row className="search-box" noGutters>
            <Col className="p-3" xs="12" md="10">
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text id="search">
                    <img
                      src="/static/images/icon-search.svg"
                      className="search-icon"
                    />
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder="Search by Account ID, Transaction hash, Block hash or Block Height"
                  aria-label="Search"
                  aria-describedby="search"
                  onChange={this.handleSearchValueChange}
                  className="border-left-0 search-field pl-0"
                />
              </InputGroup>
            </Col>
            <Col className="p-3 d-flex flex-column" xs="12" md="2">
              <Button type="submit" variant="info" className="button-search">
                Search
              </Button>
            </Col>
          </Row>
        </form>
        <style jsx global>{`
          .dashboard-info-container {
            border: solid 4px #e6e6e6;
            border-radius: 4px;
          }

          .dashboard-info-container > .row:first-of-type .card-cell-text {
            font-size: 24px;
          }

          .search-box {
            border-top: 2px solid #e6e6e6;
            background: #f8f8f8;
          }

          .search-box-filter-button {
            border-radius: 25px;
            padding-left: 20px;
            padding-right: 20px;
          }

          .search-box .input-group-text {
            background: white;
            border-right: 0;
            border-radius: 25px 0 0 25px;
          }

          .search-field {
            border-radius: 25px;
            outline: none;
            box-shadow: none !important;
            border-color: rgb(199, 210, 221) !important;
          }

          .button-search {
            border-radius: 25px;
          }

          .dashboard-link {
            text-decoration: none;
            color: #0072ce !important;
          }
        `}</style>
      </div>
    );
  }
}
