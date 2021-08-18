import { PureComponent } from "react";

import { Line, Circle } from "rc-progress";

interface Props {
  strokeWidth?: number;
  strokeColor?: string;
  trailColor?: string;
  type?: "line" | "circle";
  className?: string;
  percent?: number;
  label?: React.ReactNode | string;
}

class ProgressBar extends PureComponent<Props> {
  render() {
    const { type = "line", className = "", label } = this.props;

    return (
      <>
        {type === "line" && (
          <div className={`progress-bar line ${className}`}>
            <Line {...this.props} className="progress-bar-content" />
          </div>
        )}
        {type === "circle" && (
          <div className={`progress-bar circle ${className}`}>
            <Circle {...this.props} className="progress-bar-content" />
            {label && <div className="progress-bar-label">{label}</div>}
          </div>
        )}

        <style global jsx>{`
          .progress-bar {
            background: transparent;
            position: relative;
          }

          .progress-bar .progress-bar-content {
            background: transparent;
          }

          .progress-bar .rc-progress-line-path,
          .progress-bar .rc-progress-circle-path {
            stroke-linecap: square;
          }

          .progress-bar .progress-bar-label {
            position: absolute;
            width: 100%;
            margin: auto;
            font-size: 12px;
            font-weight: 500;
          }
        `}</style>
      </>
    );
  }
}

export default ProgressBar;
