import * as React from "react";

import { Trans, useTranslation } from "next-i18next";
import { Row, Col, Spinner } from "react-bootstrap";

import { AccountOld } from "@/common/types/procedures";
import { AccountLink } from "@/frontend/components/utils/AccountLink";
import { Balance } from "@/frontend/components/utils/Balance";
import { CardCell, CardCellText } from "@/frontend/components/utils/CardCell";
import { CopyToClipboard } from "@/frontend/components/utils/CopyToClipboard";
import { ErrorMessage } from "@/frontend/components/utils/ErrorMessage";
import { StorageSize } from "@/frontend/components/utils/StorageSize";
import { Term } from "@/frontend/components/utils/Term";
import { WalletLink } from "@/frontend/components/utils/WalletLink";
import { useDateFormat } from "@/frontend/hooks/use-date-format";
import { useFormatNumber } from "@/frontend/hooks/use-format-number";
import { useNetworkContext } from "@/frontend/hooks/use-network-context";
import { styled } from "@/frontend/libraries/styles";
import { trpc } from "@/frontend/libraries/trpc";

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

const ColoredCell = styled(CardCell, {
  backgroundColor: "#f8f8f8",
});

const TransactionsAmount = styled("span", {
  "& + &": {
    marginLeft: 10,
  },
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
              href="https://docs.near.org/docs/validator/economics#1-near-tokens-to-stake"
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
              href="https://docs.near.org/docs/validator/economics#1-near-tokens-to-stake"
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
              href="https://docs.near.org/docs/validator/economics#1-near-tokens-to-stake"
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
              href="https://docs.near.org/docs/concepts/storage-staking"
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
                href="https://docs.near.org/docs/tokens/lockup#the-lockup-contract"
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

export const AccountDetails: React.FC<Props> = React.memo(({ account }) => {
  const { t } = useTranslation();
  const transactionsQuery = trpc.account.transactionsCount.useQuery({
    id: account.accountId,
  });
  const format = useDateFormat();
  const formatNumber = useFormatNumber();

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
                href="https://docs.near.org/docs/concepts/transaction"
              />
            }
            imgLink="/static/images/icon-m-transaction.svg"
            text={
              transactionsQuery.status === "loading" ? (
                <Spinner animation="border" variant="secondary" />
              ) : transactionsQuery.status === "error" ? (
                <ErrorMessage onRetry={transactionsQuery.refetch}>
                  {transactionsQuery.error.message}
                </ErrorMessage>
              ) : transactionsQuery.data ? (
                <>
                  <TransactionsAmount>
                    ↑{formatNumber(transactionsQuery.data.outTransactionsCount)}
                  </TransactionsAmount>
                  <TransactionsAmount>
                    ↓{formatNumber(transactionsQuery.data.inTransactionsCount)}
                  </TransactionsAmount>
                </>
              ) : (
                "-"
              )
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
                  href="https://docs.near.org/docs/concepts/account"
                />
              }
              text={
                !account.created ? (
                  "Genesis"
                ) : (
                  <>
                    {format(
                      account.created.timestamp,
                      t("common.date_time.date_time_format")
                    )}
                    <CopyToClipboard
                      text={String(account.created.timestamp)}
                      css={{ marginLeft: 8 }}
                    />
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
                    href="https://docs.near.org/docs/concepts/account"
                  />
                }
                text={
                  <>
                    {account.created.hash}
                    <CopyToClipboard
                      text={account.created.hash}
                      css={{ marginLeft: 8 }}
                    />
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
                  href="https://docs.near.org/docs/concepts/account"
                />
              }
              text={
                <>
                  {format(
                    account.deleted.timestamp,
                    t("common.date_time.date_time_format")
                  )}
                  <CopyToClipboard
                    text={String(account.deleted.timestamp)}
                    css={{ marginLeft: 8 }}
                  />
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
                  href="https://docs.near.org/docs/concepts/account"
                />
              }
              text={
                <>
                  {account.deleted.hash}
                  <CopyToClipboard
                    text={account.deleted.hash}
                    css={{ marginLeft: 8 }}
                  />
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
