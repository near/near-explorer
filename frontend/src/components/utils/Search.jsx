import Router from "next/router";
import { Button, Col, FormControl, InputGroup, Row } from "react-bootstrap";

import AccountsApi from "../../libraries/explorer-wamp/accounts";
import BlocksApi from "../../libraries/explorer-wamp/blocks";
import TransactionsApi from "../../libraries/explorer-wamp/transactions";

export default class extends React.Component {
  state = { searchValue: "" };

  handleSearch = async (event) => {
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

  handleSearchValueChange = (event) => {
    if (event) {
      const value = event.target !== null ? event.target.value : "";
      this.setState({ searchValue: value });
    }
  };

  render() {
    return (
      <form onSubmit={this.handleSearch} className="search-box">
        <Row noGutters>
          <InputGroup>
            {!this.props.dashboard && (
              <InputGroup.Prepend>
                <InputGroup.Text id="search">
                  <img
                    src="/static/images/icon-search.svg"
                    className="search-icon"
                  />
                </InputGroup.Text>
              </InputGroup.Prepend>
            )}
            <FormControl
              placeholder="Search for Account ID, Txn hash, Block hash, or Block height"
              aria-label="Search"
              aria-describedby="search"
              onChange={this.handleSearchValueChange}
              className="search-field"
            />
            {this.props.dashboard && (
              <Button type="submit" variant="info" className="button-search">
                Search
              </Button>
            )}
          </InputGroup>
        </Row>
        <style jsx global>{`
          .search-box {
            background: white;
            width: ${this.props.dashboard ? "740px" : "500px"};
            max-width: 100%;
            height: ${this.props.dashboard ? "49px" : "40px"};
            margin: auto;
          }

          @media (max-width: 1000px) {
            .search-box {
              width: 100%;
            }
          }

          .input-group-text {
            background: #fafafa;
            border: 2px solid #eaebeb;
            border-right: none;
          }

          .search-field {
            background: ${this.props.dashboard ? "#FFFFFF" : "#FAFAFA"};
            border: 2px solid #eaebeb;
            border-left: ${this.props.dashboard ? "inherit" : "none"};
            box-sizing: border-box;
            border-radius: 8px;
            height: 100%;
            font-weight: lighter;
          }

          .button-search {
            background: #0072ce;
            border-color: #0072ce;
            border-radius: 0px 8px 8px 0px;
            padding: 10px 30px;
          }
        `}</style>
      </form>
    );
  }
}
