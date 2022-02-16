import { FC } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "../../libraries/styles";

const Wrapper = styled("div", {
  width: "100%",
  height: "100%",
  backgroundColor: "#f0f9ff",
  position: "relative",
  display: "flex",
});

const Value = styled("div", {
  display: "block",
  height: 75,

  variants: {
    type: {
      total: {
        backgroundColor: "#d6edff",
      },
      current: {
        backgroundColor: "#8fcdff",
      },
    },
  },
});

const CumulativeStakeLabel = styled("div", {
  position: "absolute",
  top: 0,
  right: 24,
  bottom: 0,
  display: "flex",
  alignItems: "center",
  color: "#0072ce",
  fontSize: 14,
  fontWeight: 500,
  maxWidth: 75,
});

interface Props {
  total: number;
  current: number;
}

const CumulativeStakeChart: FC<Props> = ({ total, current }) => {
  const { t } = useTranslation();
  return (
    <Wrapper>
      <Value type="total" style={{ width: total ? `${total}%` : "0%" }} />
      <Value
        type="current"
        style={{
          width: current ? `${current - total}%` : "0%",
        }}
      />
      <CumulativeStakeLabel>
        {current ? `${current}%` : t("common.state.not_available")}
      </CumulativeStakeLabel>
    </Wrapper>
  );
};

export default CumulativeStakeChart;
