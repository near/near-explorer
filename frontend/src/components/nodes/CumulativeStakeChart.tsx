import * as React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "../../libraries/styles";

const Wrapper = styled("div", {
  height: 75,
  backgroundColor: "#f0f9ff",
  position: "relative",
  display: "flex",

  color: "#0072ce",
  fontSize: 14,
  fontWeight: 500,
});

const Value = styled("div", {
  variants: {
    type: {
      accumulated: {
        backgroundColor: "#d6edff",
      },
      own: {
        backgroundColor: "#8fcdff",
      },
    },
  },
});

const Label = styled("div", {
  position: "absolute",
  top: 0,
  left: 0,
  size: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

interface Props {
  percents: {
    ownPercent: number;
    cumulativePercent: number;
  } | null;
}

export const FRACTION_DIGITS = 2;

const CumulativeStakeChart: React.FC<Props> = React.memo(({ percents }) => {
  const { t } = useTranslation();
  if (!percents) {
    return (
      <Wrapper>
        <Label>{t("common.state.not_available")}</Label>
      </Wrapper>
    );
  }
  const accumulatedPercent = (
    (percents.cumulativePercent - percents.ownPercent) *
    100
  ).toFixed(FRACTION_DIGITS);
  const ownPercent = (percents.ownPercent * 100).toFixed(FRACTION_DIGITS);
  const cumulativePercent = (percents.cumulativePercent * 100).toFixed(
    FRACTION_DIGITS
  );
  return (
    <Wrapper>
      <Value type="accumulated" style={{ width: `${accumulatedPercent}%` }} />
      <Value type="own" style={{ width: `${ownPercent}%` }} />
      <Label>{`${cumulativePercent}%`}</Label>
    </Wrapper>
  );
});

export default CumulativeStakeChart;
