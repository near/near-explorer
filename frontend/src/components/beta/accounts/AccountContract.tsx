import * as React from "react";

import { useTranslation } from "react-i18next";

import ShortenValue from "@explorer/frontend/components/beta/common/ShortenValue";
import Timestamp from "@explorer/frontend/components/beta/common/Timestamp";
import TransactionLink from "@explorer/frontend/components/beta/common/TransactionLink";
import { styled } from "@explorer/frontend/libraries/styles";
import { trpc } from "@explorer/frontend/libraries/trpc";

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

const AccountContract: React.FC<Props> = React.memo(({ id }) => {
  const { t } = useTranslation();
  const contractQuery = trpc.useQuery(["contract.byId", { id }]);
  if (!contractQuery.data) {
    return null;
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
      {contractQuery.data.timestamp ? (
        <div>
          <SmallHeader>
            {t("pages.account.header.contract.updatedTimestamp")}
          </SmallHeader>
          <Timestamp timestamp={contractQuery.data.timestamp} />
        </div>
      ) : null}
      {contractQuery.data.transactionHash ? (
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

export default AccountContract;