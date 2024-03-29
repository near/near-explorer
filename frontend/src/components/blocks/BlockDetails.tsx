import * as React from "react";

import JSBI from "jsbi";
import { useTranslation } from "next-i18next";
import { Row, Col } from "react-bootstrap";

import { Block } from "@/common/types/procedures";
import { EMPTY_CODE_HASH } from "@/common/utils/constants";
import { AccountLink } from "@/frontend/components/utils/AccountLink";
import { BlockLink } from "@/frontend/components/utils/BlockLink";
import {
  CardCell,
  CardCellText,
  CardCellWrapper,
} from "@/frontend/components/utils/CardCell";
import { CopyToClipboard } from "@/frontend/components/utils/CopyToClipboard";
import { Gas } from "@/frontend/components/utils/Gas";
import { GasPrice } from "@/frontend/components/utils/GasPrice";
import { Term } from "@/frontend/components/utils/Term";
import { useDateFormat } from "@/frontend/hooks/use-date-format";
import { useFormatNumber } from "@/frontend/hooks/use-format-number";
import { subscriptions } from "@/frontend/hooks/use-subscription";
import { styled } from "@/frontend/libraries/styles";

const BlockInfoContainer = styled(Col, {
  border: "solid 4px #e6e6e6",
  borderRadius: 4,

  "& > .row": {
    borderBottom: "2px solid #e6e6e6",
  },

  "& > .row:last-of-type": {
    borderBottom: 0,
  },

  "@media (max-width: 768px)": {
    [`& ${CardCellWrapper}`]: {
      borderLeft: 0,
    },
  },
});

const BlockInfoHeader = styled(Row, {
  [`& ${CardCellText}`]: {
    fontSize: 24,
  },
});

const ParentHashCell = styled(CardCell, {
  backgroundColor: "#f8f8f8",
});

export interface Props {
  block: Block;
}

export const BlockDetails: React.FC<Props> = React.memo(({ block }) => {
  const { t } = useTranslation();
  const latestBlockSub = subscriptions.latestBlock.useSubscription();
  const gasUsed = React.useMemo(
    () => JSBI.BigInt(block.gasUsed),
    [block.gasUsed]
  );
  const format = useDateFormat();
  const formatNumber = useFormatNumber();

  return (
    <Row noGutters>
      <BlockInfoContainer>
        <BlockInfoHeader noGutters>
          <Col md="4">
            <CardCell
              title={
                <Term
                  title={t("component.blocks.BlockDetails.transactions.title")}
                  text={t("component.blocks.BlockDetails.transactions.text")}
                  href="https://docs.near.org/docs/concepts/transaction"
                />
              }
              imgLink="/static/images/icon-m-transaction.svg"
              text={formatNumber(block.transactionsCount)}
              className="border-0"
            />
          </Col>
          <Col md="4">
            <CardCell
              title={t("component.blocks.BlockDetails.receipts.title")}
              text={block.receiptsCount.toString()}
            />
          </Col>
          <Col md="4">
            <CardCell
              title={
                <Term
                  title={t("component.blocks.BlockDetails.status.title")}
                  text={t("component.blocks.BlockDetails.status.text")}
                  href="https://docs.near.org/docs/develop/front-end/rpc#block"
                />
              }
              imgLink="/static/images/icon-t-status.svg"
              text={
                latestBlockSub.status !== "success"
                  ? t("common.blocks.status.checking_finality")
                  : block.timestamp < latestBlockSub.data.timestamp
                  ? t("common.blocks.status.finalized")
                  : t("common.blocks.status.finalizing")
              }
            />
          </Col>
        </BlockInfoHeader>
        <Row noGutters>
          <Col md="4">
            <CardCell
              title={t("component.blocks.BlockDetails.author.title")}
              text={<AccountLink accountId={block.authorAccountId} />}
              className="border-0"
            />
          </Col>
          <Col md="4">
            <CardCell
              title={
                <Term
                  title={t("component.blocks.BlockDetails.gas_used.title")}
                  text={t("component.blocks.BlockDetails.gas_used.text")}
                  href="https://docs.near.org/docs/concepts/gas"
                />
              }
              imgLink="/static/images/icon-m-size.svg"
              text={<Gas gas={gasUsed} />}
            />
          </Col>
          <Col md="4">
            <CardCell
              title={
                <Term
                  title={t("component.blocks.BlockDetails.gas_price.title")}
                  text={t("component.blocks.BlockDetails.gas_price.text")}
                  href="https://docs.near.org/docs/concepts/gas"
                />
              }
              imgLink="/static/images/icon-m-filter.svg"
              text={<GasPrice gasPrice={block.gasPrice} />}
            />
          </Col>
        </Row>
        <Row noGutters>
          <Col md="4">
            <CardCell
              title={
                <Term
                  title={t("component.blocks.BlockDetails.created.title")}
                  text={t("component.blocks.BlockDetails.created.text")}
                />
              }
              text={
                <>
                  {format(
                    block.timestamp,
                    t("common.date_time.date_time_format")
                  )}
                  <CopyToClipboard
                    text={String(block.timestamp)}
                    css={{ marginLeft: 8 }}
                  />
                </>
              }
              className="border-0"
            />
          </Col>
          <Col md="8">
            <CardCell
              title={
                <Term
                  title={t("component.blocks.BlockDetails.hash.title")}
                  text={t("component.blocks.BlockDetails.hash.text")}
                />
              }
              text={block.hash}
            />
          </Col>
        </Row>
        <Row noGutters>
          <Col md="12">
            <ParentHashCell
              title={
                <Term
                  title={t("component.blocks.BlockDetails.parent_hash.title")}
                  text={t("component.blocks.BlockDetails.parent_hash.text")}
                />
              }
              text={
                block.prevHash === EMPTY_CODE_HASH ? (
                  "Genesis"
                ) : (
                  <BlockLink blockHash={block.prevHash}>
                    {block.prevHash}
                  </BlockLink>
                )
              }
              className="border-0"
            />
          </Col>
        </Row>
      </BlockInfoContainer>
    </Row>
  );
});
