import * as React from "react";

import { Badge } from "react-bootstrap";

import { styled } from "@/frontend/libraries/styles";

const NearBadgeWrapper = styled(Badge, {
  border: "1px solid #f0f0f1",
  borderRadius: 8,
  fontWeight: 500,
  fontSize: 14,
  color: "#a2a2a8",
  background: "transparent",
});

export const NearBadge: React.FC = React.memo(() => (
  <NearBadgeWrapper variant="light">NEAR</NearBadgeWrapper>
));
