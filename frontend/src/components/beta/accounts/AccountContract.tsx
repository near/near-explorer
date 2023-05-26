import * as React from "react";

import { useTranslation } from "react-i18next";

import { ShortenValue } from "@/frontend/components/beta/common/ShortenValue";
import { Timestamp } from "@/frontend/components/beta/common/Timestamp";
import { TransactionLink } from "@/frontend/components/beta/common/TransactionLink";
import { ErrorMessage } from "@/frontend/components/utils/ErrorMessage";
import { styled } from "@/frontend/libraries/styles";
import { trpc } from "@/frontend/libraries/trpc";

type Props = {
  id: string;
};

const ContractInfo = styled("div", {
  display: "flex",
  flexWrap: "wrap",

  "> *": {
    marginRight: 24,
  },
  "> *:last-child": {
    marginRight: 0,
  },
});

export const SmallHeader = styled("div", {
  fontSize: 12,
  color: "#c9c9c9",
});

export const AccountContract: React.FC<Props> = React.memo(({ id }) => {
  const { t } = useTranslation();
  const contractQuery = trpc.contract.byId.useQuery({ id });
  if (contractQuery.status === "loading" || contractQuery.data === null) {
    return null;
  }
  if (contractQuery.status === "error") {
    return (
      <ErrorMessage onRetry={contractQuery.refetch}>
        {contractQuery.error.message}
      </ErrorMessage>
    );
  }
  return (
    <ContractInfo>
      <div>
        <SmallHeader>
          {t("pages.account.header.contract.lockedStatus")}
        </SmallHeader>
        <span>
          {contractQuery.data.locked
            ? t("pages.account.header.contract.status.locked")
            : t("pages.account.header.contract.status.unlocked")}
        </span>
      </div>
      <div>
        <SmallHeader>{t("pages.account.header.contract.codeHash")}</SmallHeader>
        <ShortenValue>{contractQuery.data.codeHash}</ShortenValue>
      </div>
      {"timestamp" in contractQuery.data ? (
        <div>
          <SmallHeader>
            {t("pages.account.header.contract.updatedTimestamp")}
          </SmallHeader>
          <Timestamp timestamp={contractQuery.data.timestamp} />
        </div>
      ) : null}
      {"transactionHash" in contractQuery.data ? (
        <div>
          <SmallHeader>
            {t("pages.account.header.contract.updatedTransaction")}
          </SmallHeader>
          <TransactionLink hash={contractQuery.data.transactionHash} />
        </div>
      ) : null}
    </ContractInfo>
  );
});
