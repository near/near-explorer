import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { shortenString } from "@explorer/frontend/libraries/formatting";

type Props = {
  value: string;
  tooltipId: string;
  children: React.ReactElement;
};

const StringConditionalOverlay: React.FC<Props> = ({
  value,
  tooltipId,
  children,
}) => {
  if (value.length === shortenString(value).length) {
    return children;
  }
  return (
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip id={tooltipId}>{value}</Tooltip>}
    >
      {children}
    </OverlayTrigger>
  );
};

export default StringConditionalOverlay;
