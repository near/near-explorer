import * as React from "react";

import JSBI from "jsbi";
import { useTranslation } from "next-i18next";
import { Row, Col } from "react-bootstrap";

import { TransactionOutcomeOld } from "@/common/types/procedures";
import { Balance } from "@/frontend/components/utils/Balance";
import { Gas } from "@/frontend/components/utils/Gas";
import { styled } from "@/frontend/libraries/styles";

const TransactionOutcomeRow = styled(Row, {
  paddingTop: 10,
  borderLeft: "2px solid #e5e5e5",
});

const TransactionOutcomeTitle = styled(Col, {
  fontSize: 14,
  lineHeight: 1.29,
  color: "#24272a",

  variants: {
    main: {
      true: {
        paddingBottom: 10,
      },
    },
  },
});

const TransactionOutcomeText = styled(Col, {
  fontSize: 14,
  fontWeight: 500,
  lineHeight: 1.29,
});

export interface Props {
  outcome: TransactionOutcomeOld;
}

export const TransactionOutcome: React.FC<Props> = React.memo(({ outcome }) => {
  const { t } = useTranslation();
  const gasBurnt = JSBI.BigInt(outcome.gasBurnt);
  return (
    <Row noGutters>
      <Col>
        <Row noGutters>
          <TransactionOutcomeTitle main>
            <b>
              {t(
                "common.transactions.execution.convert_transaction_to_receipt"
              )}
            </b>
          </TransactionOutcomeTitle>
        </Row>

        <TransactionOutcomeRow noGutters className="mx-0 pl-4">
          <TransactionOutcomeTitle>
            {t("common.transactions.execution.gas_burned")}:
          </TransactionOutcomeTitle>
          <TransactionOutcomeText>
            <Gas gas={gasBurnt} />
          </TransactionOutcomeText>
        </TransactionOutcomeRow>

        <TransactionOutcomeRow noGutters className="mx-0 pl-4">
          <TransactionOutcomeTitle>
            {t("common.transactions.execution.tokens_burned")}:
          </TransactionOutcomeTitle>
          <TransactionOutcomeText>
            <Balance amount={outcome.tokensBurnt} />
          </TransactionOutcomeText>
        </TransactionOutcomeRow>
      </Col>
    </Row>
  );
});
