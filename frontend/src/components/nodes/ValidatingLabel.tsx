import { FC } from "react";
import { Badge, OverlayTrigger, Tooltip } from "react-bootstrap";
import { StakingStatus } from "../../libraries/wamp/types";

import { styled } from "../../libraries/styles";

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
      "on-hold": {
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

interface Props {
  text: string;
  type: StakingStatus;
  tooltipKey: string;
}

const ValidatingLabel: FC<Props> = ({ type, text, tooltipKey, children }) => (
  <OverlayTrigger
    placement={"right"}
    overlay={<Tooltip id={tooltipKey}>{text}</Tooltip>}
  >
    <ValidatingLabelWrapper type={type}>{children}</ValidatingLabelWrapper>
  </OverlayTrigger>
);

export default ValidatingLabel;
