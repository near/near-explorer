import React from "react";
import { Badge, OverlayTrigger, Tooltip } from "react-bootstrap";

interface Props {
  text: string;
  type: string;
  tooltipKey: string;
}

class ValidatingLabel extends React.PureComponent<Props> {
  render() {
    const { type, text, tooltipKey, children } = this.props;
    return (
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

            .validating-label.pending {
              background-color: #6ad1e3;
              color: #11869a;
            }

            .validating-label.new {
              background-color: #ffc107;
              color: #ffffff;
            }

            .validating-label.kickout {
              background-color: #dc3545;
              color: #ffffff;
            }
          `}</style>
        </Badge>
      </OverlayTrigger>
    );
  }
}

export default ValidatingLabel;
