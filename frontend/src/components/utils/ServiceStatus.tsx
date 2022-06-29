import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import toast from "react-hot-toast";
import { usePrevious } from "../../hooks/use-previous";
import {
  UseSubscriptionResult,
  useSubscription,
} from "../../hooks/use-subscription";
import { styled } from "../../libraries/styles";
import { MINUTE, SECOND } from "../../libraries/time";
import { HealthStatus } from "../../types/common";
import Timer from "./Timer";

const Wrapper = styled("div", {
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  size: 12,
  borderRadius: "50%",
  background: "#2A2A2A",
});

const Indicator = styled("div", {
  size: 4,
  borderRadius: "50%",

  variants: {
    type: {
      success: {
        background: "#0DF8B7",
      },
      warning: {
        background: "#F5B842",
      },
      error: {
        background: "#FF004C",
      },
    },
  },
});

const Message = styled("span", {
  fontWeight: "bold",

  variants: {
    type: {
      success: {
        color: "#0DCE99",
      },
      warning: {
        color: "#EBAC34",
      },
      error: {
        color: "#FF004C",
      },
    },
  },
});

const BORDER_COLOR = "#F7F7F7";
const ARROW_SIDE = 10;
const ARROW_OFFSET = 3;

const TooltipRight = styled(Tooltip, {
  whiteSpace: "nowrap",
  opacity: "1 !important",

  "& > .tooltip-inner": {
    display: "inline-block",
    position: "relative",
    textAlign: "left",
    color: "#333",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: BORDER_COLOR,
    padding: "12px 20px",
    margin: "0 0 0 10px",
    filter: "drop-shadow(rgba(0, 0, 0, 0.4) 0 2px 3px)",
    borderRadius: 24,
    fontSize: 10,
    lineHeight: "12px",
    maxWidth: "initial",
  },

  "& > .arrow": {
    display: "none !important",
  },

  "& > .tooltip-inner::before, .tooltip-inner::after": {
    content: "",
    display: "block",
    position: "absolute",
    right: "100%",
    width: 0,
    height: 0,
    borderStyle: "solid",
  },

  "& > .tooltip-inner::after": {
    top: `calc(50% - ${ARROW_SIDE}px)`,
    borderColor: `transparent #fff transparent transparent`,
    borderWidth: ARROW_SIDE,
    left: -ARROW_SIDE * 2 + ARROW_OFFSET,
  },

  "& > .tooltip-inner::before": {
    top: `calc(50% - ${ARROW_SIDE}px)`,
    borderColor: `transparent ${BORDER_COLOR} transparent transparent`,
    borderWidth: ARROW_SIDE,
    left: -(ARROW_SIDE * 2 + 1) + ARROW_OFFSET,
  },
});

const hadNoHealthIn = (
  health: UseSubscriptionResult<HealthStatus>,
  inMs: number
): boolean => {
  if (health.status !== "success") {
    return false;
  }
  return health.data.timestamp + inMs < Date.now();
};

const AFFORDABLE_LAG = 30 * SECOND;
const getStatusWithMessage = (
  rpc: UseSubscriptionResult<HealthStatus>,
  indexer: UseSubscriptionResult<HealthStatus>
): {
  type: "warning" | "error" | "success";
  message: string;
  timestamp: number;
} => {
  if (rpc.status === "error" || indexer.status === "error") {
    return {
      type: "warning",
      message: "Explorer backend is down",
      timestamp: Math.max(rpc.errorUpdatedAt, indexer.errorUpdatedAt),
    };
  }
  if (
    hadNoHealthIn(rpc, AFFORDABLE_LAG) ||
    hadNoHealthIn(indexer, AFFORDABLE_LAG)
  ) {
    const maxTimestamp = Math.max(
      rpc.errorUpdatedAt,
      indexer.errorUpdatedAt,
      rpc.dataUpdatedAt,
      indexer.dataUpdatedAt
    );
    return {
      type: "warning",
      message: "Lost connection to explorer backend",
      timestamp: maxTimestamp,
    };
  }
  if (rpc.status === "success" && !rpc.data.ok) {
    return {
      type: "error",
      message: rpc.data.message ?? "RPC is down",
      timestamp: rpc.dataUpdatedAt,
    };
  }
  if (indexer.status === "success" && !indexer.data.ok) {
    return {
      type: "warning",
      message: indexer.data.message ?? "Indexer is down",
      timestamp: indexer.dataUpdatedAt,
    };
  }
  return {
    type: "success",
    message: "All systems go",
    timestamp: Math.min(rpc.dataUpdatedAt, indexer.dataUpdatedAt),
  };
};

export const ServiceStatusView: React.FC = () => {
  const rpcStatusSub = useSubscription(["rpcStatus"]);
  const indexerStatusSub = useSubscription(["indexerStatus"]);

  const status = getStatusWithMessage(rpcStatusSub, indexerStatusSub);
  const previousStatus = usePrevious(status);

  const [runningToasts, setRunningToasts] = React.useState<
    {
      id: string;
      message: string;
    }[]
  >([]);
  React.useEffect(() => {
    if (status.timestamp === previousStatus?.timestamp) {
      return;
    }
    if (status.type === "success") {
      runningToasts.forEach(({ id }) => toast.dismiss(id));
      setRunningToasts([]);
      return;
    }
    if (runningToasts.some((toast) => toast.message === status.message)) {
      return;
    }
    const toastId =
      status.type === "error"
        ? toast.error(status.message, { duration: MINUTE })
        : toast.custom(status.message, { duration: MINUTE });
    setRunningToasts((toasts) => [
      ...toasts,
      {
        id: toastId,
        message: status.message,
      },
    ]);
  }, [status, previousStatus, setRunningToasts, runningToasts]);

  return (
    <OverlayTrigger
      placement="right"
      overlay={(props) => (
        <TooltipRight id="status" {...props}>
          <Message type={status.type}>{status.message}</Message>{" "}
          <Timer time={status.timestamp} />
        </TooltipRight>
      )}
    >
      <Wrapper>
        <Indicator type={status.type} />
      </Wrapper>
    </OverlayTrigger>
  );
};
