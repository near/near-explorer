import Link from "next/link";

import {Button, Col, Dropdown, FormControl, InputGroup, Row} from "react-bootstrap";

import CardCell from "../utils/CardCell";
// import AccountApi from "../../libraries/explorer-wamp/accounts";

export class DashboardHeader extends React.Component {

  // account;

  constructor(props) {
    super(props);
    this.state = {
      searchFilterValue: 'ALL FILTERS',
      searchValue: ''
    };

    // this.account = new AccountApi();

    this.handleClick = this.handleClick.bind(this);
    this.handleFilterSelect = this.handleFilterSelect.bind(this);
    this.handleSearchValueChange = this.handleSearchValueChange.bind(this);
  }

  async handleClick() {

    console.log('click');

    // try {
    //
    //   await this.account.queryAccount(
    //     this.state.searchValue
    //   );
    // } catch (e) {
    //
    //   console.error(e);
    // }
  }

  handleFilterSelect(eventKey) {

    switch (eventKey) {
      case '1':
        this.setState({
          searchFilterValue: 'Accounts'
        });
        break;
      case '2':
        this.setState({
          searchFilterValue: 'Transactions'
        });
        break;
      case '3':
        this.setState({
          searchFilterValue: 'Blocks'
        });
        break;
      default:
        this.setState({
          searchFilterValue: 'ALL FILTERS'
        });
        break;
    }
  }

  handleSearchValueChange(event) {

    this.setState({searchValue: event.target.value});
  }

  render() {
    const {
      onlineNodesCount,
      totalNodesCount,
      lastBlockHeight,
      transactionsPerSecond,
      lastDayTxCount,
      accountsCount
    } = this.props;

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
        <Row className="search-box" noGutters>
          <Col className="p-3" xs="12" md="2">
            <Dropdown className="d-flex flex-column">
              <Dropdown.Toggle
                className="search-box-filter-button"
                variant="outline-info"
                id="all-filters-button"
              >
                {this.state.searchFilterValue}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onSelect={this.handleFilterSelect} eventKey='1'>Accounts</Dropdown.Item>
                <Dropdown.Item onSelect={this.handleFilterSelect} eventKey='2'>Transactions</Dropdown.Item>
                <Dropdown.Item onSelect={this.handleFilterSelect} eventKey='3'>Blocks</Dropdown.Item>
                <Dropdown.Item onSelect={this.handleFilterSelect} eventKey='4'>All filters</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
          <Col className="p-3" xs="12" md="8">
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text id="search" className="search-icon">🔎</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                placeholder="Search by account name, TX hash, or block number"
                aria-label="Search"
                aria-describedby="search"
                onChange={this.handleSearchValueChange}
                className="border-left-0 search-field pl-0"
              />
            </InputGroup>
          </Col>
          <Col className="p-3 d-flex flex-column" xs="12" md="2">
            <Button variant="info" className="button-search" onClick={this.handleClick}>Search</Button>
          </Col>
        </Row>
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
      .search-icon {
        background: white;
        border-right: 0;
        border-radius: 25px;
      }
      .search-field {
        border-radius: 25px;
        outline:none;
        box-shadow: none!important;
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
