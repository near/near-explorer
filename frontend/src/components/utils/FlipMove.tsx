import FlipMove from "react-flip-move";

export interface Props {
  className?: string;
  duration?: number;
  staggerDurationBy?: number;
  children?: React.ReactNode;
}

export default ({ className, children, ...props }: Props) => {
  if (typeof document === "undefined" || document.hidden) {
    return <div className={className}>{children}</div>;
  }
  return (
    <FlipMove className={className} {...props}>
      {children}
    </FlipMove>
  );
};
