import { FC } from "react";
import { Badge, OverlayTrigger, Tooltip } from "react-bootstrap";
import { StakingStatus } from "../../libraries/wamp/types";

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
    <Badge className={`validating-label ${type}`}>
      {children}
      <style global jsx>{`
        .validating-label {
          padding: 2px 8px;
          border-radius: 50px;
          font-size: 12px;
          font-weight: 500;
          line-height: 150%;
        }

        .validating-label.active {
          background-color: #c8f6e0;
          color: #008d6a;
        }

        .validating-label.proposal {
          background-color: #6ad1e3;
          color: #11869a;
        }

        .validating-label.joining {
          background-color: #ffc107;
          color: #ffffff;
        }

        .validating-label.leaving {
          background-color: #dc3545;
          color: #ffffff;
        }
        .validating-label.idle {
          background-color: #e5e5e6;
          color: #72727a;
        }
        .validating-label.on-hold {
          background-color: #2d9cdb;
          color: #ffffff;
        }
        .validating-label.newcomer {
          background-color: #f2994a;
          color: #ffffff;
        }
      `}</style>
    </Badge>
  </OverlayTrigger>
);

export default ValidatingLabel;
