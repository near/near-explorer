import { createStitches, PropertyValue } from "@stitches/react";

const stitches = createStitches({
  utils: {
    size: (value: PropertyValue<"width" | "height">) => ({
      width: value,
      height: value,
    }),
    marginHorizontal: (value: PropertyValue<"marginLeft" | "marginRight">) => ({
      marginLeft: value,
      marginRight: value,
    }),
    marginVertical: (value: PropertyValue<"marginTop" | "marginBottom">) => ({
      marginTop: value,
      marginBottom: value,
    }),
    paddingHorizontal: (
      value: PropertyValue<"paddingLeft" | "paddingRight">
    ) => ({
      paddingLeft: value,
      paddingRight: value,
    }),
    paddingVertical: (
      value: PropertyValue<"paddingTop" | "paddingBottom">
    ) => ({
      paddingTop: value,
      paddingBottom: value,
    }),
  },
});

export const { styled, globalCss, getCssText, css } = stitches;
