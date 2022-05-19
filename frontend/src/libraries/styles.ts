import { createStitches, PropertyValue } from "@stitches/react";

const stitches = createStitches({
  utils: {
    size: (value: PropertyValue<"width" | "height">) => ({
      width: value,
      height: value,
    }),
  },
});

export const { styled, globalCss, getCssText, css } = stitches;
