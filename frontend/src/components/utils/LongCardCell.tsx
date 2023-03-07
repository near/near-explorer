import * as React from "react";

import { Row, Col, Spinner } from "react-bootstrap";

import {
  TRPCSubscriptionKey,
  TRPCSubscriptionOutput,
} from "@explorer/common/types/trpc";
import { UseSubscriptionResultByTopic } from "@explorer/frontend/hooks/use-subscription";
import { typedMemo } from "@explorer/frontend/libraries/react";
import { CSS, styled } from "@explorer/frontend/libraries/styles";

const CardCellText = styled(Col, {
  fontWeight: 900,
  fontSize: 31,
  color: "#25272a",

  "@media (max-width: 415px)": {
    fontSize: 25,
  },
});

const LongCardCellWrapper = styled(Row, {
  padding: 8,
  margin: "9px 0",

  "@media (max-width: 744px)": {
    width: "100%",
  },

  "@media (max-width: 415px)": {
    width: "100%",
  },

  variants: {
    withLink: {
      true: {
        "&:hover": {
          background: "#f9f9f9",
          borderRadius: 8,
        },
        [`&:hover ${CardCellText}`]: {
          color: "#0072ce",
        },
      },
    },
  },
});

const LongCardCellTitle = styled(Col, {
  color: "#9b9b9b",
  fontSize: 14,
  fontWeight: 500,
  marginBottom: 5,
});

export interface Props<K extends TRPCSubscriptionKey> {
  title: React.ReactNode;
  subscription: UseSubscriptionResultByTopic<K>;
  children: (result: TRPCSubscriptionOutput<K>) => React.ReactNode;
  className?: string;
  textCss?: CSS;
}

const LongCardCell = typedMemo(
  <K extends TRPCSubscriptionKey>({
    title,
    subscription,
    className,
    textCss,
    children,
  }: Props<K>) => (
    <LongCardCellWrapper className={className} noGutters>
      <Col>
        <Row noGutters>
          <LongCardCellTitle xs="12" className="align-self-center">
            {title}
          </LongCardCellTitle>
          <CardCellText
            xs="12"
            md="12"
            className="ml-auto align-self-center"
            css={textCss}
          >
            {subscription.status === "loading" ||
            subscription.status === "idle" ? (
              <Spinner animation="border" variant="secondary" />
            ) : subscription.status === "success" ? (
              children(subscription.data)
            ) : null}
          </CardCellText>
        </Row>
      </Col>
    </LongCardCellWrapper>
  )
);

export default LongCardCell;
