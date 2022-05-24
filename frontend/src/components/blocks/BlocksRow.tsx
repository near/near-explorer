import JSBI from "jsbi";

import * as React from "react";

import { Row, Col } from "react-bootstrap";

import Timer from "../utils/Timer";
import Link from "../utils/Link";

import { useTranslation } from "react-i18next";
import { useFinalBlockTimestampNanosecond } from "../../hooks/data";
import { BlockBase } from "../../types/common";
import { styled } from "../../libraries/styles";

const TransactionRow = styled(Row, {
  paddingVertical: 10,
  borderTop: "solid 2px #f8f8f8",
  "&:hover": {
    background: "rgba(0, 0, 0, 0.1)",
  },
});

const TransactionRowTitle = styled(Col, {
  fontSize: 14,
  fontWeight: 500,
  lineHeight: 1.29,
  color: "#24272a",
  wordBreak: "break-word",
});

const TransactionRowText = styled(Col, {
  fontSize: 12,
  fontWeight: 500,
  lineHeight: 1.5,
  color: "#999999",
});

const TransactionRowTransactionId = styled(Col, {
  fontSize: 14,
  fontWeight: 500,
  lineHeight: 1.29,
  color: "#0072ce",
});

const TransactionRowTimer = styled(Col, {
  fontSize: 12,
  color: "#999999",
  fontWeight: 100,
});

const TransactionRowTimerStatus = styled("span", {
  fontWeight: 500,
});

const LinkWrapper = styled("a", {
  textDecoration: "none",
});

const BlockIcon = styled("img", {
  width: 20,
});

const TransactionIcon = styled("img", {
  width: 12,
});

export interface Props {
  block: BlockBase;
}

const BlocksRow: React.FC<Props> = React.memo(({ block }) => {
  const { t } = useTranslation();
  const finalBlockTimestampNanosecond = useFinalBlockTimestampNanosecond();
  return (
    <Link href={`/blocks/${block.hash}`} passHref>
      <LinkWrapper>
        <TransactionRow className="mx-0">
          <Col md="auto" xs="1" className="pr-0">
            <img src="/static/images/icon-m-block.svg" />
          </Col>
          <Col md="auto" xs="1" className="pr-0">
            <BlockIcon src="/static/images/icon-m-block.svg" />
          </Col>
          <Col md="7" xs="6">
            <Row>
              <TransactionRowTitle>#{block.height}</TransactionRowTitle>
            </Row>
            <Row>
              <TransactionRowText>
                <Row>
                  <Col md="auto">
                    <TransactionIcon src="/static/images/icon-m-transaction.svg" />
                    {` ${block.transactionsCount}`}
                  </Col>
                </Row>
              </TransactionRowText>
            </Row>
          </Col>
          <Col md="3" xs="4" className="ml-auto text-right">
            <Row>
              <TransactionRowTransactionId>
                {block.hash !== undefined
                  ? `${block.hash.substring(0, 7)}...`
                  : null}
              </TransactionRowTransactionId>
            </Row>
            <Row>
              <TransactionRowTimer>
                <TransactionRowTimerStatus>
                  {!finalBlockTimestampNanosecond
                    ? t("common.blocks.status.checking_finality")
                    : JSBI.lessThan(
                        JSBI.BigInt(block.timestamp),
                        JSBI.divide(
                          finalBlockTimestampNanosecond,
                          JSBI.BigInt(10 ** 6)
                        )
                      )
                    ? t("common.blocks.status.finalized")
                    : t("common.blocks.status.finalizing")}
                </TransactionRowTimerStatus>
                &nbsp;&nbsp;
                <Timer time={block.timestamp} />
              </TransactionRowTimer>
            </Row>
          </Col>
        </TransactionRow>
      </LinkWrapper>
    </Link>
  );
});

export default BlocksRow;
