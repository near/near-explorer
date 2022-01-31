import moment from "moment";

import { FC, useCallback, useMemo } from "react";

import { Row, Col } from "react-bootstrap";

import CardCell from "../utils/CardCell";
import Term from "../utils/Term";
import TransactionLink from "../utils/TransactionLink";

import { Trans, useTranslation } from "react-i18next";
import { useWampQuery } from "../../hooks/wamp";

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
      <div className="contract-title">
        <img
          src={"/static/images/icon-d-contract.svg"}
          className="card-cell-title-img"
        />
        {t("common.contracts.contract")}
      </div>
      <div className="contract-info-container">
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
              className="block-card-created-text border-0"
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
              className="block-card-created border-0"
            />
          </Col>
        </Row>
        <Row noGutters className="border-0">
          <Col md="4">
            <CardCell
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
              className="block-card-created-text account-card-back border-0"
            />
          </Col>
          <Col md="8">
            <CardCell
              title={
                <Term
                  title={t(
                    "component.contracts.ContractDetails.code_hash.title"
                  )}
                  text={t("component.contracts.ContractDetails.code_hash.text")}
                />
              }
              text={contractInfo.codeHash}
              className="block-card-created account-card-back border-0"
            />
          </Col>
        </Row>
      </div>
      <style jsx global>{`
        .contract-title {
          position: relative;
          z-index: 1;
          padding: 8px;
          width: 140px;
          top: 16px;
          margin-top: 32px;
          margin-left: 50px;
          background: #ffffff;
          box-sizing: border-box;
          border-radius: 25px;
          font-size: 14px;
          line-height: 16px;
          color: #999999;
          font-weight: 500;
          letter-spacing: 1.75px;
          text-transform: uppercase;
        }

        .contract-info-container {
          border: solid 4px #e6e6e6;
          border-radius: 4px;
          margin: 0 15px;
          background: #f8f8f8;
        }
      `}</style>
    </>
  );
};

export default ContractDetails;
