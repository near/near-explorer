import * as React from "react";

import { Trans, useTranslation } from "next-i18next";
import { Row, Col } from "react-bootstrap";

import CardCell, {
  CardCellTitleImage,
} from "@/frontend/components/utils/CardCell";
import CopyToClipboard from "@/frontend/components/utils/CopyToClipboard";
import ErrorMessage from "@/frontend/components/utils/ErrorMessage";
import Term from "@/frontend/components/utils/Term";
import TransactionLink from "@/frontend/components/utils/TransactionLink";
import { useDateFormat } from "@/frontend/hooks/use-date-format";
import { styled } from "@/frontend/libraries/styles";
import { trpc } from "@/frontend/libraries/trpc";

const ContractInfoContainer = styled("div", {
  border: "solid 4px #e6e6e6",
  borderRadius: 4,
  background: "#f8f8f8",
});

const ContractTitle = styled("div", {
  position: "relative",
  zIndex: 1,
  padding: 8,
  width: 140,
  top: 16,
  marginTop: 32,
  marginLeft: 50,
  background: "#ffffff",
  boxSizing: "border-box",
  borderRadius: 25,
  fontSize: 14,
  lineHeight: "16px",
  color: "#999999",
  fontWeight: 500,
  letterSpacing: 1.75,
  textTransform: "uppercase",
});

const ColoredCell = styled(CardCell, {
  backgroundColor: "#f8f8f8",
});

interface Props {
  accountId: string;
}

const ContractDetails: React.FC<Props> = React.memo(({ accountId }) => {
  const { t } = useTranslation();
  const contractQuery = trpc.contract.byId.useQuery({ id: accountId });
  const format = useDateFormat();
  if (contractQuery.status === "loading" || !contractQuery.data) {
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
    <>
      <ContractTitle>
        <CardCellTitleImage src="/static/images/icon-d-contract.svg" />
        {t("common.contracts.contract")}
      </ContractTitle>
      <ContractInfoContainer>
        <Row noGutters className="border-0">
          <Col md="4">
            <CardCell
              title={
                <Term
                  title={t(
                    "component.contracts.ContractDetails.last_updated.title"
                  )}
                  text={t(
                    "component.contracts.ContractDetails.last_updated.text"
                  )}
                  href="https://docs.near.org/docs/develop/basics/getting-started"
                />
              }
              text={
                "timestamp" in contractQuery.data ? (
                  <>
                    {format(
                      contractQuery.data.timestamp,
                      t("common.date_time.date_time_format")
                    )}
                    <CopyToClipboard
                      text={String(contractQuery.data.timestamp)}
                      css={{ marginLeft: 8 }}
                    />
                  </>
                ) : (
                  t("common.state.not_available")
                )
              }
              className="border-0"
            />
          </Col>
          <Col md="8">
            <CardCell
              title={
                <Term
                  title={t(
                    "component.contracts.ContractDetails.transaction_hash.title"
                  )}
                  text={t(
                    "component.contracts.ContractDetails.transaction_hash.text"
                  )}
                />
              }
              text={
                "transactionHash" in contractQuery.data ? (
                  <TransactionLink
                    transactionHash={contractQuery.data.transactionHash}
                  >
                    {contractQuery.data.transactionHash}
                  </TransactionLink>
                ) : (
                  t("common.state.not_available")
                )
              }
              className="border-0"
            />
          </Col>
        </Row>
        <Row noGutters className="border-0">
          <Col md="4">
            <ColoredCell
              title={
                <Term
                  title={t("component.contracts.ContractDetails.locked.title")}
                  text={
                    <Trans
                      i18nKey="component.contracts.ContractDetails.locked.text"
                      components={{ p: <p />, ol: <ol />, li: <li /> }}
                    />
                  }
                />
              }
              text={
                contractQuery.data.locked
                  ? t("common.state.yes")
                  : t("common.state.no")
              }
              className="border-0"
            />
          </Col>
          <Col md="8">
            <ColoredCell
              title={
                <Term
                  title={t(
                    "component.contracts.ContractDetails.code_hash.title"
                  )}
                  text={t("component.contracts.ContractDetails.code_hash.text")}
                />
              }
              text={contractQuery.data.codeHash}
              className="border-0"
            />
          </Col>
        </Row>
      </ContractInfoContainer>
    </>
  );
});

export default ContractDetails;
