import Link from "next/link";
import { Button, Col, FormControl, InputGroup, Row } from "react-bootstrap";

import CardCell from "../utils/CardCell";
import AccountApi from "../../libraries/explorer-wamp/accounts";
import BlocksApi from "../../libraries/explorer-wamp/blocks";
import TransactionsApi from "../../libraries/explorer-wamp/transactions";
import DetailsApi from "../../libraries/explorer-wamp/details";

import Router from "next/router";

export default class DashboardHeader extends React.Component {
  state = {
    searchValue: "",
    lastBlockHeight: this.props.details.lastBlockHeight
  };

  handleSearch = async event => {
    event.preventDefault();

    const { searchValue } = this.state;

    const blockPromise = new BlocksApi()
      .getBlockInfo(searchValue)
      .catch(() => {});
    const transactionPromise = new TransactionsApi()
      .getTransactionInfo(searchValue)
      .catch(() => {});
    const accountPromise = new AccountApi()
      .queryAccount(searchValue)
      .catch(() => {});

    if (await blockPromise) {
      return Router.push("/blocks/" + searchValue);
    }
    const transaction = await transactionPromise;
    if (transaction && transaction.signerId) {
      return Router.push("/transactions/" + searchValue);
    }
    if (await accountPromise) {
      return Router.push("/accounts/" + searchValue);
    }

    alert("Nothing found!");
  };

  handleSearchValueChange = event => {
    this.setState({ searchValue: event.target.value });
  };

  componentDidMount() {
    this.regularFetchInfo();
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    this.timer = false;
  }

  fetchInfo = async () => {
    const details = await new DetailsApi().getDetails().catch(() => null);
    this.setState({ lastBlockHeight: details.lastBlockHeight });
  };

  regularFetchInfo = async () => {
    await this.fetchInfo();
    if (this.timer !== false) {
      this.timer = setTimeout(this.regularFetchInfo, 10000);
    }
  };

  render() {
    const {
      onlineNodesCount,
      totalNodesCount,
      transactionsPerSecond,
      lastDayTxCount,
      accountsCount
    } = this.props.details;

    const { lastBlockHeight } = this.state;

    return (
      <div className="dashboard-info-container">
        <Row noGutters>
          <Col xs="12" md="3">
            <Link href="/nodes">
              <a>
                <CardCell
                  title="Nodes Online"
                  imgLink="/static/images/icon-m-node-online.svg"
                  text={`${onlineNodesCount.toLocaleString()}/${totalNodesCount.toLocaleString()}`}
                  className="border-0"
                />
              </a>
            </Link>
          </Col>
          <Col xs="12" md="3">
            <CardCell
              title="Block Height"
              imgLink="/static/images/icon-m-height.svg"
              text={lastBlockHeight.toLocaleString()}
            />
          </Col>
          <Col xs="12" md="2">
            <CardCell
              title="Tps"
              imgLink="/static/images/icon-m-tps.svg"
              text={transactionsPerSecond.toLocaleString()}
            />
          </Col>
          <Col xs="12" md="2">
            <CardCell
              title="Last Day Tx"
              imgLink="/static/images/icon-m-transaction.svg"
              text={lastDayTxCount.toLocaleString()}
            />
          </Col>
          <Col xs="12" md="2">
            <Link href="accounts">
              <a>
                <CardCell
                  title="Accounts"
                  imgLink="/static/images/icon-m-user.svg"
                  text={accountsCount.toLocaleString()}
                />
              </a>
            </Link>
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
                  placeholder="Search by Account ID, Transaction hash, or Block hash"
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
        `}</style>
      </div>
    );
  }
}
