import * as React from "react";

import { styled } from "@explorer/frontend/libraries/styles";

const UTC = styled("div", {
  fontWeight: 600,
  fontSize: 12,
  lineHeight: "20px",
  color: "#fff",
  paddingHorizontal: 7,
  borderRadius: 4,
  border: "1px solid #fff",
  marginLeft: 10,
  textTransform: "uppercase",
});

const UtcLabel = React.memo(() => <UTC>utc</UTC>);

export default UtcLabel;
