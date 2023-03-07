import * as React from "react";

import cx from "classnames";
import { Row, Col, Spinner } from "react-bootstrap";

import {
  TRPCSubscriptionKey,
  TRPCSubscriptionOutput,
} from "@explorer/common/types/trpc";
import Link from "@explorer/frontend/components/utils/Link";
import { UseSubscriptionResultByTopic } from "@explorer/frontend/hooks/use-subscription";
import { typedMemo } from "@explorer/frontend/libraries/react";
import { CSS, styled } from "@explorer/frontend/libraries/styles";
import RightArrowSvg from "@explorer/frontend/public/static/images/right-arrow.svg";

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

const RightArrow = styled(Col, {
  margin: "auto 0",

  "& svg path": {
    stroke: "#9da2a5",
  },

  [`${LongCardCellWrapper}:hover & svg path`]: {
    stroke: "#0072ce",
  },
});

export interface Props<K extends TRPCSubscriptionKey> {
  title: React.ReactNode;
  subscription: UseSubscriptionResultByTopic<K>;
  children: (result: TRPCSubscriptionOutput<K>) => React.ReactNode;
  href?: string;
  className?: string;
  textCss?: CSS;
}

const LongCardCell = typedMemo(
  <K extends TRPCSubscriptionKey>({
    title,
    subscription,
    href,
    className,
    textCss,
    children,
  }: Props<K>) => {
    const plainCell = (
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
    );
    return (
      <>
        {href ? (
          <Link href={href}>
            <a>
              <LongCardCellWrapper
                className={cx("href-cell", className)}
                withLink
                noGutters
              >
                <Col>{plainCell}</Col>
                <RightArrow xs="auto">
                  <RightArrowSvg />
                </RightArrow>
              </LongCardCellWrapper>
            </a>
          </Link>
        ) : (
          <LongCardCellWrapper className={className} noGutters>
            <Col>{plainCell}</Col>
          </LongCardCellWrapper>
        )}
      </>
    );
  }
);

export default LongCardCell;
