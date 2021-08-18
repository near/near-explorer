import { PureComponent } from "react";

interface Props {
  total: number;
  current: number;
}

class CumulativeStakeChart extends PureComponent<Props> {
  render() {
    const { total, current } = this.props;
    return (
      <div className="cumulative-stake-chart">
        <div
          className="total-value"
          style={{ width: total ? `${total}%` : "0%" }}
        />
        <div
          className="current-value"
          style={{
            width: current ? `${current - total}%` : "0%",
          }}
        />
        <div className="cumulative-stake-label">
          {current ? `${current}%` : "N/A"}
        </div>
        <style global jsx>{`
          .cumulative-stake-chart {
            width: 100%;
            height: 100%;
            background-color: #f0f9ff;
            position: relative;
            display: flex;
          }
          .total-value,
          .current-value {
            display: block;
            height: 75px;
          }
          .total-value {
            background-color: #d6edff;
          }
          .current-value {
            background-color: #8fcdff;
          }
          .cumulative-stake-label {
            position: absolute;
            top: 0;
            right: 24px;
            bottom: 0;
            display: flex;
            align-items: center;
            color: #0072ce;
            font-size: 14px;
            font-weight: 500;
          }
        `}</style>
      </div>
    );
  }
}

export default CumulativeStakeChart;
