import * as React from "react";

import { styled } from "@/frontend/libraries/styles";

const PlaceholderWrapper = styled("div", {
  width: "100%",
  background: "rgba(106, 209, 227, 0.15)",
  color: "#6ab9e3",
  padding: "5px 10px",
  cursor: "pointer",
});

const PlaceholderText = styled("p", {
  margin: 3,
});

export type Props = {
  children: React.ReactNode;
} & React.ComponentProps<typeof PlaceholderWrapper>;

const Placeholder: React.FC<Props> = React.memo(({ children, ...props }) => (
  <PlaceholderWrapper {...props}>
    <PlaceholderText>{children}</PlaceholderText>
  </PlaceholderWrapper>
));

export default Placeholder;
