import * as React from "react";

import { Badge, OverlayTrigger, Tooltip } from "react-bootstrap";
import { TFunction, useTranslation } from "react-i18next";

import { styled } from "@explorer/frontend/libraries/styles";

export type StakingStatus =
  | "active"
  | "joining"
  | "leaving"
  | "proposal"
  | "idle"
  | "onHold"
  | "newcomer";

const ValidatingLabelWrapper = styled(Badge, {
  padding: "2px 8px",
  borderRadius: 50,
  fontSize: 12,
  fontWeight: 500,
  lineHeight: "150%",

  variants: {
    type: {
      active: {
        backgroundColor: "#c8f6e0",
        color: "#008d6a",
      },
      proposal: {
        backgroundColor: "#6ad1e3",
        color: "#11869a",
      },
      joining: {
        backgroundColor: "#ffc107",
        color: "#ffffff",
      },
      leaving: {
        backgroundColor: "#dc3545",
        color: "#ffffff",
      },
      idle: {
        backgroundColor: "#e5e5e6",
        color: "#72727a",
      },
      onHold: {
        backgroundColor: "#2d9cdb",
        color: "#ffffff",
      },
      newcomer: {
        backgroundColor: "#f2994a",
        color: "#ffffff",
      },
    },
  },
});

const TOOLTIP_TEXTS: Record<StakingStatus, (t: TFunction<"common">) => string> =
  {
    active: (t) => t("component.nodes.ValidatorMainRow.state.active.text"),
    joining: (t) => t("component.nodes.ValidatorMainRow.state.joining.text"),
    leaving: (t) => t("component.nodes.ValidatorMainRow.state.leaving.text"),
    proposal: (t) => t("component.nodes.ValidatorMainRow.state.proposal.text"),
    idle: (t) => t("component.nodes.ValidatorMainRow.state.idle.text"),
    newcomer: (t) => t("component.nodes.ValidatorMainRow.state.newcomer.text"),
    onHold: (t) => t("component.nodes.ValidatorMainRow.state.onHold.text"),
  };
const LABEL_TEXTS: Record<StakingStatus, (t: TFunction<"common">) => string> = {
  active: (t) => t("component.nodes.ValidatorMainRow.state.active.title"),
  joining: (t) => t("component.nodes.ValidatorMainRow.state.joining.title"),
  leaving: (t) => t("component.nodes.ValidatorMainRow.state.leaving.title"),
  proposal: (t) => t("component.nodes.ValidatorMainRow.state.proposal.title"),
  idle: (t) => t("component.nodes.ValidatorMainRow.state.idle.title"),
  newcomer: (t) => t("component.nodes.ValidatorMainRow.state.newcomer.title"),
  onHold: (t) => t("component.nodes.ValidatorMainRow.state.onHold.title"),
};

interface Props {
  type: StakingStatus;
}

const ValidatingLabel: React.FC<Props> = React.memo(({ type }) => {
  const { t } = useTranslation();
  return (
    <OverlayTrigger
      placement="right"
      overlay={<Tooltip id={type}>{TOOLTIP_TEXTS[type](t)}</Tooltip>}
    >
      <ValidatingLabelWrapper type={type}>
        {LABEL_TEXTS[type](t)}
      </ValidatingLabelWrapper>
    </OverlayTrigger>
  );
});

export default ValidatingLabel;
