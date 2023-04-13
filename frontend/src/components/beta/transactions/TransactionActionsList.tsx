import * as React from "react";

import { intervalToDuration } from "date-fns";
import { useTranslation } from "next-i18next";

import { Transaction } from "@explorer/common/types/procedures";
import TransactionReceipt from "@explorer/frontend/components/beta/transactions/TransactionReceipt";
import { styled } from "@explorer/frontend/libraries/styles";
import { formatDurationString } from "@explorer/frontend/libraries/time";

type Props = {
  transaction: Transaction;
};

const Container = styled("div", {
  minHeight: "calc(100vh - 360px)",
  background: "#fff",
});

const Wrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: 1196,
  margin: "32px auto",
  padding: 40,
  fontFamily: "Manrope",
  border: "1px solid #ebebeb",
  borderRadius: 10,
});

const TitleWrapper = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  marginBottom: 30,

  "& span": {
    color: "#a3a3a3",
    fontSize: 10,
    fontWeight: 400,
    lineHeight: 1,
  },
});

const Title = styled("h4", {
  fontSize: 16,
  fontWeight: "700",
  lineHeight: 1,
  marginBottom: 0,
});

const Expand = styled("div", {
  fontSize: 14,
  fontWeight: 400,
  color: "#000",
  cursor: "pointer",
  userSelect: "none",

  "& span": {
    marginLeft: 10,
    color: "inherit",
    fontSize: "inherit",
    fontWeight: "inherit",
  },
});

const TransactionActionsList: React.FC<Props> = React.memo(
  ({ transaction: { timestamp, receipt } }) => {
    const [expandAll, setExpandAll] = React.useState(false);
    const expandAllReceipts = React.useCallback(
      () => setExpandAll((x) => !x),
      [setExpandAll]
    );
    const { t } = useTranslation();

    const lastNestedTransaction =
      receipt.outcome.nestedReceipts[receipt.outcome.nestedReceipts.length - 1];

    const duration = intervalToDuration({
      start: timestamp,
      end:
        lastNestedTransaction && "outcome" in lastNestedTransaction
          ? lastNestedTransaction.outcome.block.timestamp
          : Date.now(),
    });

    return (
      <Container>
        <Wrapper>
          <TitleWrapper>
            <div>
              <Title>{t("pages.transaction.executionPlan")}</Title>
              <span>
                {t("pages.transaction.processed", {
                  time: formatDurationString(
                    duration,
                    locale.durationFormatter
                  ),
                })}
              </span>
            </div>
            <Expand onClick={expandAllReceipts}>
              {t("pages.transaction.expandAll")}
              <span>+</span>
            </Expand>
          </TitleWrapper>
          <TransactionReceipt
            receipt={receipt}
            fellowOutgoingReceipts={[]}
            className=""
            convertionReceipt
            expandAll={expandAll}
          />
        </Wrapper>
      </Container>
    );
  }
);

export default TransactionActionsList;
