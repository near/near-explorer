import { styled } from "../../libraries/styles";

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

export interface Props {
  children: string | React.ReactNode;
}

const Placeholder = ({ children }: Props) => (
  <PlaceholderWrapper>
    <PlaceholderText>{children}</PlaceholderText>
  </PlaceholderWrapper>
);

export default Placeholder;
