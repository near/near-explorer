import * as React from "react";

import { useTranslation } from "next-i18next";
import { Badge, Col, Row } from "react-bootstrap";

import Link from "@explorer/frontend/components/utils/Link";
import { useSubscription } from "@explorer/frontend/hooks/use-subscription";
import { styled } from "@explorer/frontend/libraries/styles";

const NodeSelector = styled(Col, {
  height: "100%",
  fontSize: 16,
  fontWeight: 500,
  textDecoration: "none",
  paddingHorizontal: 0,
  marginLeft: 16,
  marginTop: 2,
  textAlign: "center",
  color: "#111618",
  borderBottom: "2px solid #2b9af4",

  "&:hover": {
    color: "#111618",
  },
});

const NodeAmountLabel = styled(Badge, {
  borderRadius: 50,
  lineHeight: "150%",
  fontWeight: 500,
  backgroundColor: "#00c08b",
  color: "#ffffff",
});

const NodeLink = styled(Link, {
  color: "inherit",
  "&:hover": {
    color: "inherit",
  },
});

const NodeNav: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const { data: networkStats } = useSubscription(["network-stats"]);

  return (
    <Row>
      <NodeSelector xs="auto" selected className="pt-2 pb-2">
        <NodeLink href="/nodes/validators">
          {t("component.nodes.NodeNav.validating")}{" "}
          <NodeAmountLabel pill>
            {networkStats ? networkStats.currentValidatorsCount : "--"}
          </NodeAmountLabel>
        </NodeLink>
      </NodeSelector>
    </Row>
  );
});

export default NodeNav;
