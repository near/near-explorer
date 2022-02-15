import FlipMove from "react-flip-move";

export interface Props {
  duration?: number;
  staggerDurationBy?: number;
  children?: React.ReactNode;
}

const FlipMoveEx = ({ children, ...props }: Props) => {
  if (typeof document === "undefined" || document.hidden) {
    return <div>{children}</div>;
  }
  return <FlipMove {...props}>{children}</FlipMove>;
};

export default FlipMoveEx;
