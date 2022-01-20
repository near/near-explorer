import moment from "moment";

import { FC, useEffect, useState } from "react";

import { Row, Col } from "react-bootstrap";

import ContractsApi from "../../libraries/explorer-wamp/contracts";

import CardCell from "../utils/CardCell";
import Term from "../utils/Term";
import TransactionLink from "../utils/TransactionLink";

import { Trans, useTranslation } from "react-i18next";

interface Props {
  accountId: string;
}

interface State {
  locked?: boolean;
  transactionHash?: string;
  timestamp?: number;
  codeHash?: string;
}

const ContractDetails: FC<Props> = ({ accountId }) => {
  const { t } = useTranslation();
  const [
    { locked, transactionHash, timestamp, codeHash },
    setState,
  ] = useState<State>({});

  useEffect(() => {
    new ContractsApi()
      .getExtendedContractInfo(accountId)
      .then((contractInfo) => {
        if (contractInfo) {
          setState({
            codeHash: contractInfo.codeHash,
            transactionHash: contractInfo.transactionHash,
            timestamp: contractInfo.timestamp,
            locked: contractInfo.accessKeys.every(
              (key: any) =>
                key["access_key"]["permission"]["FunctionCall"] !== undefined
            ),
          });
        }
        return;
      })
      .catch((err) => console.error(err));
  }, [accountId]);

  let lockedShow: string | undefined;
  if (locked !== undefined) {
    lockedShow = locked === true ? t("common.state.yes") : t("common.state.no");
  }
  if (!codeHash) {
    return <></>;
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
                timestamp
                  ? moment(timestamp).format(
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
                transactionHash ? (
                  <TransactionLink transactionHash={transactionHash}>
                    {transactionHash}
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
              text={codeHash ? codeHash : ""}
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
