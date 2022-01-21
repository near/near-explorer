import moment from "moment";

import { FC, useEffect, useState } from "react";

import { Row, Col, Spinner } from "react-bootstrap";

import AccountsApi, { Account } from "../../libraries/explorer-wamp/accounts";

import CardCell from "../utils/CardCell";
import Term from "../utils/Term";
import AccountLink from "../utils/AccountLink";
import Balance from "../utils/Balance";
import TransactionLink from "../utils/TransactionLink";
import WalletLink from "../utils/WalletLink";
import StorageSize from "../utils/StorageSize";

import { Trans, useTranslation } from "react-i18next";
import { useNetworkContext } from "../../hooks/use-network-context";
import { styled } from "../../libraries/stitches.config";

const AccountInfoContainer = styled("div", {
  border: "solid 4px #e6e6e6",
  borderRadius: 4,
  "& > .row:first-of-type .card-cell-text": {
    fontSize: 24,
  },

  "& > .row": {
    borderBottom: "2px solid #e6e6e6",
  },
});

const TransactionLinkIcon = styled("img", {
  width: 15,
  margin: "0 0 12px 12px",
});

export interface Props {
  account: Partial<Omit<Account, "accountId">> & { accountId: string };
}

const AccountDetails: FC<Props> = ({ account }) => {
  const { t } = useTranslation();
  const { currentNetwork } = useNetworkContext();
  const [outTransactionsCount, setOutTransactionsCount] = useState<number>();
  const [inTransactionsCount, setInTransactionsCount] = useState<number>();
  useEffect(() => {
    setOutTransactionsCount(undefined);
    setInTransactionsCount(undefined);
    new AccountsApi()
      .getAccountTransactionsCount(account.accountId)
      .then((accountStats) => {
        if (accountStats) {
          setOutTransactionsCount(accountStats.outTransactionsCount);
          setInTransactionsCount(accountStats.inTransactionsCount);
        }
        return;
      })
      .catch((error) => {
        console.warn(
          "Account information retrieval failed for ",
          account.accountId,
          error
        );
      });
  }, [account.accountId]);

  return (
    <AccountInfoContainer>
      <Row noGutters>
        <Col
          xs="12"
          md={typeof account.storageUsage === "undefined" ? "12" : "4"}
        >
          <CardCell
            title={
              <Term
                title={t(
                  "component.accounts.AccountDetails.transactions.title"
                )}
                text={t("component.accounts.AccountDetails.transactions.text")}
                href={"https://docs.near.org/docs/concepts/transaction"}
              />
            }
            imgLink="/static/images/icon-m-transaction.svg"
            text={
              <>
                <span>
                  &uarr;
                  {outTransactionsCount !== undefined ? (
                    outTransactionsCount.toLocaleString()
                  ) : (
                    <Spinner animation="border" variant="secondary" />
                  )}
                </span>
                &nbsp;&nbsp;
                <span>
                  &darr;
                  {inTransactionsCount !== undefined ? (
                    inTransactionsCount.toLocaleString()
                  ) : (
                    <Spinner animation="border" variant="secondary" />
                  )}
                </span>
              </>
            }
            className="border-0"
          />
        </Col>
        {typeof account.storageUsage !== "undefined" && (
          <Col xs="12" md={account.lockupAccountId ? "4" : "8"}>
            <CardCell
              title={
                <Term
                  title={t(
                    "component.accounts.AccountDetails.storage_usage.title"
                  )}
                  text={t(
                    "component.accounts.AccountDetails.storage_usage.text"
                  )}
                  href={"https://docs.near.org/docs/concepts/storage-staking"}
                />
              }
              imgLink="/static/images/icon-storage.svg"
              text={<StorageSize value={Number(account.storageUsage)} />}
            />
          </Col>
        )}
        {account.lockupAccountId && (
          <Col xs="12" md="4">
            <CardCell
              title={
                <Term
                  title={t(
                    "component.accounts.AccountDetails.lockup_account.title"
                  )}
                  text={t(
                    "component.accounts.AccountDetails.lockup_account.text"
                  )}
                  href={
                    "https://docs.near.org/docs/tokens/lockup#the-lockup-contract"
                  }
                />
              }
              imgLink="/static/images/icon-m-transaction.svg"
              text={
                account.lockupAccountId ? (
                  <AccountLink accountId={account.lockupAccountId} />
                ) : (
                  ""
                )
              }
            />
          </Col>
        )}
      </Row>
      {typeof account.nonStakedBalance !== "undefined" &&
        typeof account.stakedBalance !== "undefined" && (
          <Row noGutters>
            <Col xs="12" md="4">
              <CardCell
                title={
                  <Term
                    title={t(
                      "component.accounts.AccountDetails.native_account_balance.title"
                    )}
                    text={t(
                      "component.accounts.AccountDetails.native_account_balance.text"
                    )}
                    href={
                      "https://docs.near.org/docs/validator/economics#1-near-tokens-to-stake"
                    }
                  />
                }
                text={<Balance amount={account.nonStakedBalance} />}
                className="border-0"
              />
            </Col>
            <Col md="4">
              <CardCell
                title={
                  <Term
                    title={t(
                      "component.accounts.AccountDetails.validator_stake.title"
                    )}
                    text={
                      <Trans
                        i18nKey="component.accounts.AccountDetails.validator_stake.text"
                        components={{ p: <p /> }}
                      />
                    }
                    href={
                      "https://docs.near.org/docs/validator/economics#1-near-tokens-to-stake"
                    }
                  />
                }
                text={<Balance amount={account.stakedBalance} />}
              />
            </Col>
            <Col md="4">
              <CardCell
                title={
                  <Term
                    title={t(
                      "component.accounts.AccountDetails.balance_profile.title"
                    )}
                    text={t(
                      "component.accounts.AccountDetails.balance_profile.text"
                    )}
                    href={
                      "https://docs.near.org/docs/validator/economics#1-near-tokens-to-stake"
                    }
                  />
                }
                text={
                  <WalletLink
                    accountId={account.accountId}
                    nearWalletProfilePrefix={
                      currentNetwork.nearWalletProfilePrefix
                    }
                  />
                }
              />
            </Col>
          </Row>
        )}
      {account.deletedAtBlockTimestamp === null ||
      typeof account.deletedAtBlockTimestamp === "undefined" ? (
        <Row noGutters className="border-0">
          <Col md="4">
            <CardCell
              title={
                <Term
                  title={t(
                    "component.accounts.AccountDetails.created_at.title"
                  )}
                  text={t("component.accounts.AccountDetails.created_at.text")}
                  href={"https://docs.near.org/docs/concepts/account"}
                />
              }
              text={
                account.createdByTransactionHash === null ||
                account.createdByTransactionHash === "Genesis" ? (
                  "Genesis"
                ) : account.createdAtBlockTimestamp ? (
                  <>
                    {moment(account.createdAtBlockTimestamp).format(
                      t("common.date_time.date_time_format")
                    )}
                  </>
                ) : (
                  t("common.state.not_available")
                )
              }
              className="account-card-back border-0"
            />
          </Col>
          {account.createdByTransactionHash === null ||
          account.createdByTransactionHash === "Genesis" ? null : (
            <Col md="8">
              <CardCell
                title={
                  <Term
                    title={t(
                      "component.accounts.AccountDetails.created_by_transaction.title"
                    )}
                    text={t(
                      "component.accounts.AccountDetails.created_by_transaction.text"
                    )}
                    href={"https://docs.near.org/docs/concepts/account"}
                  />
                }
                text={
                  <>
                    {account.createdByTransactionHash}
                    <TransactionLink
                      transactionHash={account.createdByTransactionHash!}
                    >
                      <TransactionLinkIcon
                        src={"/static/images/icon-m-copy.svg"}
                      />
                    </TransactionLink>
                  </>
                }
                className="account-card-back border-0"
              />
            </Col>
          )}
        </Row>
      ) : (
        <Row noGutters className="border-0">
          <Col md="4">
            <CardCell
              title={
                <Term
                  title={t(
                    "component.accounts.AccountDetails.deleted_at.title"
                  )}
                  text={t("component.accounts.AccountDetails.deleted_at.text")}
                  href={"https://docs.near.org/docs/concepts/account"}
                />
              }
              text={
                <>
                  {moment(account.deletedAtBlockTimestamp).format(
                    t("common.date_time.date_time_format")
                  )}
                </>
              }
              className="account-card-back border-0"
            />
          </Col>
          <Col md="8">
            <CardCell
              title={
                <Term
                  title={t(
                    "component.accounts.AccountDetails.deleted_by_transaction.title"
                  )}
                  text={t(
                    "component.accounts.AccountDetails.deleted_by_transaction.text"
                  )}
                  href={"https://docs.near.org/docs/concepts/account"}
                />
              }
              text={
                <>
                  {account.deletedByTransactionHash}
                  <TransactionLink
                    transactionHash={account.deletedByTransactionHash!}
                  >
                    <TransactionLinkIcon
                      src={"/static/images/icon-m-copy.svg"}
                    />
                  </TransactionLink>
                </>
              }
              className="account-card-back border-0"
            />
          </Col>
        </Row>
      )}
      <style jsx global>{`
        .account-card-back {
          background-color: #f8f8f8;
        }
      `}</style>
    </AccountInfoContainer>
  );
};

export default AccountDetails;
