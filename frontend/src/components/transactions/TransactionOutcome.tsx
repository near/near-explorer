import BN from "bn.js";
import * as React from "react";
import { Row, Col } from "react-bootstrap";

import Gas from "../utils/Gas";
import Balance from "../utils/Balance";

import { useTranslation } from "react-i18next";
import { styled } from "../../libraries/styles";
import { TransactionOutcome } from "../../types/common";

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
  transaction: TransactionOutcome;
}

const TransactionOutcomeView: React.FC<Props> = React.memo(
  ({ transaction }) => {
    const { t } = useTranslation();
    const gasBurnt = new BN(transaction.outcome?.gas_burnt ?? 0);
    const tokensBurnt = new BN(transaction.outcome?.tokens_burnt ?? 0);
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
              {gasBurnt ? <Gas gas={gasBurnt} /> : "..."}
            </TransactionOutcomeText>
          </TransactionOutcomeRow>

          <TransactionOutcomeRow noGutters className="mx-0 pl-4">
            <TransactionOutcomeTitle>
              {t("common.transactions.execution.tokens_burned")}:
            </TransactionOutcomeTitle>
            <TransactionOutcomeText>
              {tokensBurnt ? (
                <Balance amount={tokensBurnt.toString()} />
              ) : (
                "..."
              )}
            </TransactionOutcomeText>
          </TransactionOutcomeRow>
        </Col>
      </Row>
    );
  }
);

export default TransactionOutcomeView;
