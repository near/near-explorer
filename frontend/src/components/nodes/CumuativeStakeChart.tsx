interface Props {
  value: CummulativeStake;
}

interface CummulativeStake {
  total: number;
  current: number;
}

const CumulativeStakeChart = ({ value }: Props) => (
  <div className="cumulative-stake-chart">
    <div className="total-value" style={{ width: `${value.total}%` }} />
    <div className="current-value" />
    <div className="cumulative-stake-label">{value.current}%</div>
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
        width: 11px;
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

export default CumulativeStakeChart;
