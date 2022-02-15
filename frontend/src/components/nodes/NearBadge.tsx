import { Badge } from "react-bootstrap";
import { styled } from "../../libraries/styles";

const NearBadgeWrapper = styled(Badge, {
  border: "1px solid #f0f0f1",
  borderRadius: 8,
  fontWeight: 500,
  fontSize: 14,
  color: "#a2a2a8",
  background: "transparent",
});

const NearBadge = () => (
  <NearBadgeWrapper variant="light">NEAR</NearBadgeWrapper>
);

export default NearBadge;
