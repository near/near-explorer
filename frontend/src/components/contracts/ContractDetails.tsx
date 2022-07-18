import { useDateFormat } from "../../hooks/use-date-format";
import * as React from "react";

import { Row, Col } from "react-bootstrap";

import CardCell, { CardCellTitleImage } from "../utils/CardCell";
import Term from "../utils/Term";
import TransactionLink from "../utils/TransactionLink";

import { Trans, useTranslation } from "react-i18next";
import { trpc } from "../../libraries/trpc";
import { styled } from "../../libraries/styles";

const ContractInfoContainer = styled("div", {
  border: "solid 4px #e6e6e6",
  borderRadius: 4,
  margin: "0 15px",
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
  const { data: contractInfo } = trpc.useQuery([
    "contract.byId",
    { id: accountId },
  ]);
  const format = useDateFormat();
  if (!contractInfo) {
    return null;
  }
  return (
    <>
      <ContractTitle>
        <CardCellTitleImage src={"/static/images/icon-d-contract.svg"} />
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
                  href={
                    "https://docs.near.org/docs/develop/basics/getting-started"
                  }
                />
              }
              text={
                contractInfo.timestamp
                  ? format(
                      contractInfo.timestamp,
                      t("common.date_time.date_time_format")
                    )
                  : t("common.state.not_available")
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
                contractInfo.transactionHash ? (
                  <TransactionLink
                    transactionHash={contractInfo.transactionHash}
                  >
                    {contractInfo.transactionHash}
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
                contractInfo.locked
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
              text={contractInfo.codeHash}
              className="border-0"
            />
          </Col>
        </Row>
      </ContractInfoContainer>
    </>
  );
});

export default ContractDetails;
