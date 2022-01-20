import { FC } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  total: number;
  current: number;
}

const CumulativeStakeChart: FC<Props> = ({ total, current }) => {
  const { t } = useTranslation();
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
        {current ? `${current}%` : t("common.state.not_available")}
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
          max-width: 75px;
        }
      `}</style>
    </div>
  );
};

export default CumulativeStakeChart;
