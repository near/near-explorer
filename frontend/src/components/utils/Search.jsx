import Router from "next/router";
import { Button, FormControl, InputGroup, Row } from "react-bootstrap";

import AccountsApi from "../../libraries/explorer-wamp/accounts";
import BlocksApi from "../../libraries/explorer-wamp/blocks";
import TransactionsApi from "../../libraries/explorer-wamp/transactions";

export default class extends React.Component {
  state = { searchValue: "" };

  handleSearch = async (event) => {
    event.preventDefault();

    const { searchValue } = this.state;
    const cleanedSearchValue = searchValue.replace(/\s/g, "");

    let blockPromise;
    const maybeBlockHeight = cleanedSearchValue.replace(/[,]/g, "");
    if (maybeBlockHeight.match(/^\d{1,20}$/)) {
      const blockHeight = parseInt(maybeBlockHeight);
      blockPromise = new BlocksApi().getBlockInfo(blockHeight).catch(() => {});
    } else {
      blockPromise = new BlocksApi()
        .getBlockInfo(cleanedSearchValue)
        .catch(() => {});
    }

    const transactionPromise = new TransactionsApi()
      .getTransactionInfo(cleanedSearchValue)
      .catch(() => {});
    const accountPromise = new AccountsApi()
      .queryAccount(cleanedSearchValue)
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
      <form onSubmit={this.handleSearch} className="new-search-box">
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
          .new-search-box {
            background: white;
            width: ${this.props.dashboard ? "740px" : "520px"};
            max-width: 100%;
            height: ${this.props.dashboard ? "49px" : "40px"};
            margin: auto;
          }

          @media (max-width: 1000px) {
            .new-search-box {
              width: 100%;
            }
          }

          .new-search-box .input-group-text {
            background: #fafafa;
            border: 2px solid #eaebeb;
            border-right: none;
            border-radius: 8px;
          }

          .new-search-box .search-field {
            background: ${this.props.dashboard ? "#FFFFFF" : "#FAFAFA"};
            border: 2px solid #eaebeb;
            border-radius: 0.25rem;
            border-left: ${this.props.dashboard ? "2px solid #eaebeb" : "none"};
          }

          .new-search-box .button-search {
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
