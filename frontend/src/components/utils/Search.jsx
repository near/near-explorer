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
      <form onSubmit={this.handleSearch} className="search-box">
        <Row noGutters className="search-box">
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
              autoCorrect="off"
              autoCapitalize="none"
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
            width: ${this.props.dashboard ? "740px" : "520px"} !important;
            max-width: 100%;
            height: ${this.props.dashboard ? "49px" : "40px"} !important;
            margin: auto;
            border-radius: 8px;
          }

          .input-group {
            border: 2px solid #eaebeb;
            border-radius: 8px;
          }

          .input-group:focus-within {
            box-shadow: 0px 0px 0px 4px #c2e4ff;
            border-radius: 10px;
            border: 2px solid #0072ce !important;
            background: white;
          }

          @media (max-width: 1000px) {
            .search-box {
              width: 100%;
            }
          }

          .input-group:hover {
            background: #f8f9fb;
            border: 2px solid #cdcfd1;
            border-radius: 8px;
          }

          .input-group-text {
            background: #fafafa;
            height: 100%;
          }

          .input-group-text::placeholder {
            color: #a1a1a9;
          }

          .search-field {
            background: ${this.props.dashboard ? "#FFFFFF" : "#FAFAFA"};
            border-left: ${this.props.dashboard ? "inherit" : "none"};
          }

          .search-field:disabled,
          .search-field[disabled] {
            background: #eaebeb;
            border: 1px solid #eaebeb;
          }

          .form-control:focus-within {
            box-shadow: none;
          }

          .button-search {
            background: #0072ce;
            border: 2px solid #0072ce !important;
            border-radius: 0px 8px 8px 0px;
            padding: 10px 30px;
          }

          .button-search:hover {
            background: #2b9af4;
          }

          .button-search:active {
            background-color: #0072ce !important;
            border: 3px solid #0072ce !important;
          }

          .form-control {
            height: 100% !important;
          }
        `}</style>
      </form>
    );
  }
}
