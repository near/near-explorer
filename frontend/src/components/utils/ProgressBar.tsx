import { FC } from "react";

import { Line, Circle } from "rc-progress";
import { styled } from "../../libraries/styles";
import cx from "classnames";

const ProgressBarWrapper = styled("div", {
  background: "transparent",
  position: "relative",
});

const ProgressBarElement = styled("div", {
  background: "transparent",
});

const ProgressBarLabel = styled("div", {
  position: "absolute",
  width: "100%",
  margin: "auto",
  fontSize: 12,
  fontWeight: 500,
});

interface Props {
  strokeWidth?: number;
  strokeColor?: string;
  trailColor?: string;
  type?: "line" | "circle";
  className?: string;
  percent?: number;
  label?: React.ReactNode | string;
}

const ProgressBarEx: FC<Props> = ({
  type = "line",
  className,
  label,
  ...props
}) => {
  const wrapperClassName = cx(className, "progress-bar");
  if (type === "circle") {
    return (
      <ProgressBarWrapper className={wrapperClassName}>
        <ProgressBarElement as={Circle} strokeLinecap="square" {...props} />
        {label && <ProgressBarLabel>{label}</ProgressBarLabel>}
      </ProgressBarWrapper>
    );
  }
  return (
    <ProgressBarWrapper className={wrapperClassName}>
      <ProgressBarElement as={Line} strokeLinecap="square" {...props} />
    </ProgressBarWrapper>
  );
};

export default ProgressBarEx;
