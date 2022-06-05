import moment from "moment";

import * as React from "react";

import { Row, Col, Spinner } from "react-bootstrap";

import CardCell, { CardCellText } from "../utils/CardCell";
import Term from "../utils/Term";
import AccountLink from "../utils/AccountLink";
import Balance from "../utils/Balance";
import TransactionLink from "../utils/TransactionLink";
import WalletLink from "../utils/WalletLink";
import StorageSize from "../utils/StorageSize";

import { Trans, useTranslation } from "react-i18next";
import { useNetworkContext } from "../../hooks/use-network-context";
import { trpc } from "../../libraries/trpc";
import { AccountOld } from "../../types/common";
import { styled } from "../../libraries/styles";

const AccountInfoContainer = styled("div", {
  border: "solid 4px #e6e6e6",
  borderRadius: 4,
  [`& > .row:first-of-type ${CardCellText}`]: {
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

const ColoredCell = styled(CardCell, {
  backgroundColor: "#f8f8f8",
});

type StakingBalanceProps = {
  stakedBalance: string;
  nonStakedBalance: string;
  accountId: string;
};

const StakingBalanceDetails: React.FC<StakingBalanceProps> = ({
  stakedBalance,
  nonStakedBalance,
  accountId,
}) => {
  const { t } = useTranslation();
  const { network } = useNetworkContext();
  if (!network) {
    return null;
  }
  return (
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
          text={<Balance amount={nonStakedBalance} />}
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
          text={<Balance amount={stakedBalance} />}
        />
      </Col>
      <Col md="4">
        <CardCell
          title={
            <Term
              title={t(
                "component.accounts.AccountDetails.balance_profile.title"
              )}
              text={t("component.accounts.AccountDetails.balance_profile.text")}
              href={
                "https://docs.near.org/docs/validator/economics#1-near-tokens-to-stake"
              }
            />
          }
          text={
            <WalletLink
              accountId={accountId}
              nearWalletProfilePrefix={network.nearWalletProfilePrefix}
            />
          }
        />
      </Col>
    </Row>
  );
};

type DetailsProps = {
  lockupAccountId?: string;
  storageUsage: number;
};

const ExistingAccountDetails: React.FC<DetailsProps> = ({
  lockupAccountId,
  storageUsage,
}) => {
  const { t } = useTranslation();
  return (
    <>
      <Col xs="12" md={lockupAccountId ? "4" : "8"}>
        <CardCell
          title={
            <Term
              title={t("component.accounts.AccountDetails.storage_usage.title")}
              text={t("component.accounts.AccountDetails.storage_usage.text")}
              href={"https://docs.near.org/docs/concepts/storage-staking"}
            />
          }
          imgLink="/static/images/icon-storage.svg"
          text={<StorageSize value={storageUsage} />}
        />
      </Col>
      {lockupAccountId && (
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
            text={<AccountLink accountId={lockupAccountId} />}
          />
        </Col>
      )}
    </>
  );
};

export interface Props {
  account: AccountOld;
}

const AccountDetails: React.FC<Props> = React.memo(({ account }) => {
  const { t } = useTranslation();
  const { data: transactionCount } = trpc.useQuery([
    "account-transactions-count",
    [account.accountId],
  ]);

  return (
    <AccountInfoContainer>
      <Row noGutters>
        <Col xs="12" md={!account.details ? "12" : "4"}>
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
                  {transactionCount !== undefined ? (
                    transactionCount.outTransactionsCount.toLocaleString()
                  ) : (
                    <Spinner animation="border" variant="secondary" />
                  )}
                </span>
                &nbsp;&nbsp;
                <span>
                  &darr;
                  {transactionCount !== undefined ? (
                    transactionCount.inTransactionsCount.toLocaleString()
                  ) : (
                    <Spinner animation="border" variant="secondary" />
                  )}
                </span>
              </>
            }
            className="border-0"
          />
        </Col>
        {account.details ? (
          <ExistingAccountDetails
            storageUsage={account.details.storageUsage}
            lockupAccountId={account.details.lockupAccountId}
          />
        ) : null}
      </Row>
      {account.details ? (
        <StakingBalanceDetails
          accountId={account.accountId}
          stakedBalance={account.details.stakedBalance}
          nonStakedBalance={account.details.nonStakedBalance}
        />
      ) : null}
      {!account.deleted ? (
        <Row noGutters className="border-0">
          <Col md="4">
            <ColoredCell
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
                !account.created ? (
                  "Genesis"
                ) : (
                  <>
                    {moment(account.created.timestamp).format(
                      t("common.date_time.date_time_format")
                    )}
                  </>
                )
              }
              className="border-0"
            />
          </Col>
          {!account.created ? null : (
            <Col md="8">
              <ColoredCell
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
                    {account.created.hash}
                    <TransactionLink transactionHash={account.created.hash}>
                      <TransactionLinkIcon
                        src={"/static/images/icon-m-copy.svg"}
                      />
                    </TransactionLink>
                  </>
                }
                className="border-0"
              />
            </Col>
          )}
        </Row>
      ) : (
        <Row noGutters className="border-0">
          <Col md="4">
            <ColoredCell
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
                  {moment(account.deleted.timestamp).format(
                    t("common.date_time.date_time_format")
                  )}
                </>
              }
              className="border-0"
            />
          </Col>
          <Col md="8">
            <ColoredCell
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
                  {account.deleted.hash}
                  <TransactionLink transactionHash={account.deleted.hash}>
                    <TransactionLinkIcon
                      src={"/static/images/icon-m-copy.svg"}
                    />
                  </TransactionLink>
                </>
              }
              className="border-0"
            />
          </Col>
        </Row>
      )}
    </AccountInfoContainer>
  );
});

export default AccountDetails;
