import React from "react";
import RawSwitch from "rc-switch";
import { keyframes, styled } from "@explorer/frontend/libraries/styles";

type Props = {
  checked: boolean;
  onChange: (nextChecked: boolean) => void;
};

const hoverOnKeyframes = keyframes({
  "0%": {
    transform: "scale(1)",
  },
  "50%": {
    transform: "scale(1.25)",
  },
  "100%": {
    transform: "scale(1)",
  },
});
const switchKeyframes = keyframes({
  "0%": {
    transform: "scale(1.1)",
  },
  "100%": {
    transform: "scale(1)",
  },
});

const CONSTANTS = {
  sizes: {
    dot: 16,
    padding: 3,
    distance: 3,
  },
  colors: {
    dot: "#fff",
    background: {
      on: "#0072ce",
      off: "#ccc",
    },
    disabled: {
      dot: "#9e9e9e",
      background: "#ccc",
    },
  },
};

// Styles adapted from the demo: http://react-component.github.io/switch/demo/simple
const StyledSwitch = styled(RawSwitch, {
  position: "relative",
  display: "inline-block",
  boxSizing: "border-box",
  width:
    CONSTANTS.sizes.dot * 2 +
    CONSTANTS.sizes.distance +
    CONSTANTS.sizes.padding * 2,
  height: CONSTANTS.sizes.dot + CONSTANTS.sizes.padding * 2,
  lineHeight: CONSTANTS.sizes.dot + CONSTANTS.sizes.padding * 2,
  padding: 0,
  verticalAlign: "middle",
  borderRadius: CONSTANTS.sizes.dot + CONSTANTS.sizes.padding * 2,
  border: 0,
  backgroundColor: CONSTANTS.colors.background.off,
  cursor: "pointer",
  transition: "all .3s cubic-bezier(0.35, 0, 0.25, 1)",
  overflow: "hidden",
  flexShrink: 0,

  "&-inner": {
    display: "none",
  },

  "&:after": {
    position: "absolute",
    width: CONSTANTS.sizes.dot,
    height: CONSTANTS.sizes.dot,
    left: CONSTANTS.sizes.padding,
    top: CONSTANTS.sizes.padding,
    borderRadius: "50% 50%",
    backgroundColor: CONSTANTS.colors.dot,
    content: " ",
    cursor: "pointer",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.26)",
    transform: "scale(1)",
    transition: "left .3s cubic-bezier(0.35, 0, 0.25, 1)",
    animationTimingFunction: "cubic-bezier(0.35, 0, 0.25, 1)",
    animationDuration: ".3s",
    animationName: switchKeyframes,
  },

  "&:hover:after": {
    transform: "scale(1.1)",
    animationName: hoverOnKeyframes,
  },

  "&:focus": {
    boxShadow: "0 0 0 2px tint(#2db7f5, 80%)",
    outline: "none",
  },

  "&-checked": {
    backgroundColor: CONSTANTS.colors.background.on,

    "&:after": {
      left:
        CONSTANTS.sizes.dot +
        CONSTANTS.sizes.distance +
        CONSTANTS.sizes.padding,
    },
  },

  "&-disabled": {
    cursor: "no-drop",
    background: CONSTANTS.colors.disabled.background,

    "&:after:": {
      background: CONSTANTS.colors.disabled.dot,
      animationName: "none",
      cursor: "no-drop",
    },

    "&:hover:after": {
      transform: "scale(1)",
      animationName: "none",
    },
  },
});

export const Switch: React.FC<Props> = ({ checked, onChange }) => {
  return (
    <StyledSwitch
      checked={checked}
      onChange={onChange}
      prefixCls={StyledSwitch.toString().slice(1)}
    />
  );
};
