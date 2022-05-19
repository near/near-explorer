import * as React from "react";
import { Row, Col } from "react-bootstrap";

import AccountLink from "../utils/AccountLink";
import Timer from "../utils/Timer";

import { useTranslation } from "react-i18next";
import { styled } from "../../libraries/styles";

const ActionRowImage = styled("div", {
  variants: {
    type: {
      sparse: {
        margin: 10,
        display: "inline",
        size: 20,

        "& svg": {
          size: 16,
        },
      },
      compact: {
        size: 24,
        border: "solid 2px #f8f8f8",
        backgroundColor: "#ffffff",
        borderRadius: "50%",
        marginRight: 8,
        textAlign: "center",
        lineHeight: 1.1,

        "& svg": {
          size: 12,
        },
      },
    },
  },
});

const ActionRowMessage = styled(Row, {
  variants: {
    type: {
      compact: {
        marginBottom: "1em",
      },
      sparse: {},
    },
  },
});

const ActionRowDetails = styled(Col, {
  "& &": {
    border: 0,
  },
  variants: {
    type: {
      compact: {
        borderBottom: "2px solid #f8f8f8",
        margin: "0.1em 0 0",
        paddingBottom: 8,
      },
      sparse: {},
    },
  },
});

const ActionRowTitle = styled(Col, {
  fontSize: 14,
  fontWeight: 500,
  color: "#24272a",

  "& a": {
    color: "#666",
  },

  "& a:hover": {
    color: "#24272a",
  },
});

const ActionRowText = styled(Col, {
  fontSize: 12,
  fontWeight: 500,
  lineHeight: 1.5,
  color: "#999999",

  "& a": {
    color: "#999999",
  },

  "& a:hover": {
    color: "#24272a",
  },
});

const ActionRowTransaction = styled(Col, {
  fontSize: 14,
  fontWeight: 500,
  lineHeight: 1.29,
  color: "#0072ce",
});

const ActionRowTimer = styled(Col, {
  fontSize: 12,
  color: "#999999",
  fontWeight: 100,
});

const ActionRowTimerStatus = styled("span", {
  fontWeight: 500,
});

const ActionRow = styled(Row, {
  variants: {
    type: {
      sparse: {
        paddingTop: 10,
        paddingBottom: 10,
        borderTop: "solid 2px #f8f8f8",
        "& &": {
          borderTop: 0,
        },
      },
      compact: {},
    },
  },
});

export type ViewMode = "sparse" | "compact";
export type DetalizationMode = "detailed" | "minimal";
export interface Props {
  signerId: string;
  blockTimestamp?: number;
  detailsLink?: React.ReactNode;
  viewMode?: ViewMode;
  detalizationMode?: DetalizationMode;
  icon: React.ReactNode;
  title: React.ReactNode | string;
  children?: React.ReactNode;
  status?: React.ReactNode;
  isFinal?: boolean;
}

const ActionRowBlock: React.FC<Props> = React.memo(
  ({
    viewMode = "sparse",
    detalizationMode = "detailed",
    signerId,
    blockTimestamp,
    detailsLink,
    icon,
    title,
    status,
    isFinal,
    children,
  }) => {
    const { t } = useTranslation();
    return (
      <>
        <ActionRow noGutters type={viewMode} className="mx-0">
          <Col xs="auto">
            <ActionRowImage type={viewMode}>{icon}</ActionRowImage>
          </Col>
          <ActionRowDetails type={viewMode}>
            <ActionRowMessage type={viewMode} noGutters>
              <Col md="8" xs="7">
                <Row noGutters>
                  <ActionRowTitle>{title}</ActionRowTitle>
                </Row>
                {detalizationMode === "detailed" ? (
                  <Row noGutters>
                    <ActionRowText>
                      {t("component.transactions.ActionRowBlock.by")}{" "}
                      <AccountLink accountId={signerId} />
                    </ActionRowText>
                  </Row>
                ) : null}
              </Col>
              {detalizationMode === "detailed" ? (
                <Col md="4" xs="5" className="ml-auto text-right">
                  <Row>
                    <ActionRowTransaction>{detailsLink}</ActionRowTransaction>
                  </Row>
                  <Row>
                    <ActionRowTimer>
                      <ActionRowTimerStatus>
                        {status ?? (
                          <>{t("common.blocks.status.fetching_status")}</>
                        )}
                        {isFinal === undefined
                          ? "/" + t("common.blocks.status.checking_finality")
                          : isFinal === true
                          ? ""
                          : "/" + t("common.blocks.status.finalizing")}
                      </ActionRowTimerStatus>{" "}
                      {blockTimestamp && <Timer time={blockTimestamp} />}
                    </ActionRowTimer>
                  </Row>
                </Col>
              ) : null}
            </ActionRowMessage>
            {children}
          </ActionRowDetails>
        </ActionRow>
      </>
    );
  }
);

export default ActionRowBlock;
