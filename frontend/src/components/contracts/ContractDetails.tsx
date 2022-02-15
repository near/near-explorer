import moment from "moment";

import { FC, useCallback, useMemo } from "react";

import { Row, Col } from "react-bootstrap";

import CardCell, { CardCellTitleImage } from "../utils/CardCell";
import Term from "../utils/Term";
import TransactionLink from "../utils/TransactionLink";

import { Trans, useTranslation } from "react-i18next";
import { useWampQuery } from "../../hooks/wamp";
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

const ContractDetails: FC<Props> = ({ accountId }) => {
  const { t } = useTranslation();
  const contractInfo = useWampQuery(
    useCallback(
      async (wampCall) => {
        // codeHash does not exist for deleted accounts
        const account = await wampCall("nearcore-view-account", [accountId]);
        const codeHash = account["code_hash"];
        // see https://github.com/near/near-explorer/pull/841#discussion_r783205960
        if (!codeHash || codeHash === "11111111111111111111111111111111") {
          return;
        }
        const [contractInfo, accessKeys] = await Promise.all([
          wampCall("contract-info-by-account-id", [accountId]),
          wampCall("nearcore-view-access-key-list", [accountId]),
        ]);
        if (contractInfo !== undefined) {
          return {
            codeHash,
            transactionHash: contractInfo.hash,
            timestamp: contractInfo.blockTimestamp,
            accessKeys: accessKeys.keys,
          };
        } else {
          return {
            codeHash,
            accessKeys: accessKeys.keys,
          };
        }
      },
      [accountId]
    )
  );
  const locked = useMemo(
    () =>
      contractInfo?.accessKeys.every(
        (key) => key["access_key"]["permission"]["FunctionCall"] !== undefined
      ),
    [contractInfo]
  );

  let lockedShow: string | undefined;
  if (locked !== undefined) {
    lockedShow = locked === true ? t("common.state.yes") : t("common.state.no");
  }
  if (!contractInfo?.codeHash) {
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
                  ? moment(contractInfo.timestamp).format(
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
              text={lockedShow ? lockedShow : ""}
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
};

export default ContractDetails;
