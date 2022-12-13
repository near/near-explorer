import React from "react";
import { useBetaOptions } from "../../hooks/use-beta-options";
import { styled } from "../../libraries/styles";
import { Switch } from "./Switch";

const Wrapper = styled("div", {
  display: "flex",
  alignItems: "center",
  color: "#ccc",

  "& > * + *": {
    marginLeft: 8,
  },

  variants: {
    enabled: {
      true: {
        color: "#0072ce",
      },
    },
  },
});

export const BetaSwitch: React.FC = () => {
  const [betaOptions, setBetaOptions] = useBetaOptions();
  return (
    <Wrapper enabled={betaOptions?.enabled}>
      <span>Beta</span>
      <Switch
        checked={Boolean(betaOptions?.enabled)}
        onChange={(enabled) => setBetaOptions((prev) => ({ ...prev, enabled }))}
      />
    </Wrapper>
  );
};
