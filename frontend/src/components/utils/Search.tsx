import Router from "next/router";
import { FC, useState, useCallback, FormEvent } from "react";
import { Button, FormControl, InputGroup, Row } from "react-bootstrap";

import AccountsApi from "../../libraries/explorer-wamp/accounts";
import BlocksApi from "../../libraries/explorer-wamp/blocks";
import TransactionsApi from "../../libraries/explorer-wamp/transactions";
import ReceiptsApi from "../../libraries/explorer-wamp/receipts";

import { useTranslation } from "react-i18next";
import { useAnalyticsTrack } from "../../hooks/analytics/use-analytics-track";

interface Props {
  dashboard?: boolean;
}

const Search: FC<Props> = ({ dashboard }) => {
  const { t } = useTranslation();
  const track = useAnalyticsTrack();

  const [value, setValue] = useState("");
  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const cleanedSearchValue = value.replace(/\s/g, "");

      let blockPromise;
      const maybeBlockHeight = cleanedSearchValue.replace(/[,]/g, "");
      if (maybeBlockHeight.match(/^\d{1,20}$/)) {
        const blockHeight = parseInt(maybeBlockHeight);
        blockPromise = new BlocksApi()
          .getBlockByHashOrId(blockHeight)
          .catch(() => {});
      } else {
        blockPromise = new BlocksApi()
          .getBlockByHashOrId(cleanedSearchValue)
          .catch(() => {});
      }

      const transactionPromise = new TransactionsApi()
        .isTransactionIndexed(cleanedSearchValue)
        .catch(() => {});
      const accountPromise = new AccountsApi()
        .isAccountIndexed(cleanedSearchValue.toLowerCase())
        .catch(() => {});
      const receiptInTransactionPromise = new ReceiptsApi()
        .getReceiptInTransaction(cleanedSearchValue)
        .catch(() => {});

      const block = await blockPromise;
      if (block) {
        track("Explorer Search for block", { block: block });
        return Router.push("/blocks/" + block);
      }
      const transaction = await transactionPromise;
      if (transaction) {
        track("Explorer Search for transaction", {
          transaction: value,
        });
        return Router.push("/transactions/" + value);
      }
      if (await accountPromise) {
        track("Explorer Search for account", { account: value });
        return Router.push("/accounts/" + value.toLowerCase());
      }
      const receipt = await receiptInTransactionPromise;
      if (receipt && receipt.originatedFromTransactionHash) {
        return Router.push(
          `/transactions/${receipt.originatedFromTransactionHash}#${receipt.receiptId}`
        );
      }
      track("Explorer Search result not found", {
        detail: value,
      });
      alert("Result not found!");
    },
    [value, track]
  );
  const onChange = useCallback((event) => setValue(event.currentTarget.value), [
    setValue,
  ]);

  return (
    <form
      onSubmit={onSubmit}
      className={`search-box ${!dashboard ? "compact" : ""}`}
    >
      <Row noGutters className="search-box">
        <InputGroup>
          {!dashboard && (
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
            placeholder={t("component.utils.Search.hint")}
            aria-label="Search"
            aria-describedby="search"
            autoCorrect="off"
            autoCapitalize="none"
            onChange={onChange}
            className="search-field"
          />

          {dashboard && (
            <Button type="submit" variant="info" className="button-search">
              {t("component.utils.Search.title")}
            </Button>
          )}
        </InputGroup>
      </Row>
      <style jsx global>{`
        .search-box {
          background: white;
          width: 740px;
          max-width: 100%;
          height: 49px;
          margin: auto;
          border-radius: 8px;
        }

        .search-box.compact {
          width: 520px;
          height: 40px;
        }

        .search-box.compact .search-box {
          width: inherit;
          height: inherit;
        }

        .search-box.compact .search-field {
          background-color: #fafafa;
          border-left: none;
          border-right: 2px solid #eaebeb;
          border-radius: 0 8px 8px 0;
          padding-left: 0;
        }

        .search-box.compact .input-group-prepend .input-group-text {
          border: 2px solid #eaebeb;
          border-radius: 8px 0 0 8px;
          border-right: none;
          transition: border-color 0.15s ease-in-out,
            box-shadow 0.15s ease-in-out;
        }

        .search-box.compact .input-group::after {
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          display: block;
          width: 1rem;
          height: calc(100% - 8px);
          margin: auto 4px auto auto;
          filter: blur(2px);
          background: #fafafa;
          opacity: 0.9;
        }

        .input-group {
          border-radius: 8px;
        }

        .input-group:focus-within {
          box-shadow: 0px 0px 0px 4px #c2e4ff;
          border-radius: 10px;
          background: white;
        }

        .input-group:focus-within .search-field,
        .input-group:focus-within .input-group-prepend .input-group-text {
          border-color: #0072ce !important;
          background-color: white;
        }

        .search-box.compact .input-group:focus-within::after {
          background: white;
        }

        @media (max-width: 1000px) {
          .search-box,
          .search-box.compact {
            width: 100%;
          }
        }

        .input-group:hover {
          background: #f8f9fb;
          border-radius: 8px;
        }

        .input-group:hover .search-field,
        .input-group:hover .input-group-prepend .input-group-text {
          border-color: #cdcfd1;
        }

        .input-group-text {
          background: #fafafa;
          height: 100%;
        }

        .input-group-text::placeholder {
          color: #a1a1a9;
        }

        .search-field {
          background: #ffffff;
          border-left: inherit;
          border: 2px solid #eaebeb;
          border-right: none;
          border-radius: 8px 0 0 8px;
          box-shadow: none !important;
          padding-right: 0.313rem;
        }

        .search-field::placeholder {
          color: #8d9396;
        }

        .search-field:disabled,
        .search-field[disabled] {
          background: #eaebeb;
        }

        .form-control:focus-within {
          box-shadow: none;
        }

        .input-group .button-search::before {
          content: "";
          position: absolute;
          top: 0;
          left: -1.25rem;
          bottom: 0;
          display: block;
          width: 1rem;
          height: calc(100% - 8px);
          margin: auto 4px auto auto;
          filter: blur(2px);
          background: white;
          opacity: 0.9;
        }

        .button-search {
          position: relative;
          background: #0072ce;
          border: 2px solid #0072ce;
          border-radius: 0px 8px 8px 0px;
          padding: 10px 30px;
        }

        .button-search:hover {
          background: #2b9af4;
          border-color: #0072ce;
        }

        .btn-info.button-search:not(:disabled):active,
        .btn-info.button-search:not(:disabled):active:focus,
        .btn-info.button-search:not(:disabled):focus {
          background-color: #2b9af4;
          border-color: #0072ce;
          box-shadow: none;
        }

        .form-control {
          height: 100% !important;
        }
      `}</style>
    </form>
  );
};

export default Search;
