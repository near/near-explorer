import BN from "bn.js";
import { FC } from "react";
import { Row, Col } from "react-bootstrap";

import Gas from "../utils/Gas";
import Balance from "../utils/Balance";
import { TransactionOutcome as TTransactionOutcome } from "../../pages/transactions/[hash]";

import { useTranslation } from "react-i18next";
import { styled } from "../../libraries/styles";

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
  transaction: TTransactionOutcome;
}

const TransactionOutcome: FC<Props> = ({ transaction }) => {
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
            {tokensBurnt ? <Balance amount={tokensBurnt.toString()} /> : "..."}
          </TransactionOutcomeText>
        </TransactionOutcomeRow>
      </Col>
    </Row>
  );
};

export default TransactionOutcome;
