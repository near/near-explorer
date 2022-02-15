import { FC } from "react";
import { Badge, Col, Row } from "react-bootstrap";

import Link from "../utils/Link";

import { useTranslation } from "react-i18next";
import { useNetworkStats } from "../../hooks/subscriptions";
import { styled } from "../../libraries/styles";

const NodeSelector = styled(Col, {
  height: "100%",
  fontSize: 16,
  fontWeight: 500,
  textDecoration: "none",
  paddingLeft: 0,
  paddingRight: 0,
  marginLeft: 16,
  marginTop: 2,
  textAlign: "center",
  color: "#72727a",
  transition: "all 0.15s ease-in-out",

  "&:hover": {
    color: "#111618",
  },

  variants: {
    selected: {
      true: {
        color: "#111618",
        borderBottom: "2px solid #2b9af4",
      },
    },
  },
});

const NodeAmountLabel = styled(Badge, {
  borderRadius: 50,
  lineHeight: "150%",
  fontWeight: 500,
  backgroundColor: "#00c08b",
  color: "#ffffff",
});

const NodeLink = styled("a", {
  color: "inherit",
  "&:hover": {
    color: "inherit",
  },
});

interface Props {
  role: string;
}

const NodeNav: FC<Props> = ({ role }) => {
  const { t } = useTranslation();
  const networkStats = useNetworkStats();

  return (
    <Row>
      <NodeSelector
        xs="auto"
        selected={role === "validators"}
        className="pt-2 pb-2"
      >
        <Link href="/nodes/validators" passHref>
          <NodeLink>
            {t("component.nodes.NodeNav.validating")}{" "}
            <NodeAmountLabel pill>
              {networkStats ? networkStats.currentValidatorsCount : "--"}
            </NodeAmountLabel>
          </NodeLink>
        </Link>
      </NodeSelector>
    </Row>
  );
};

export default NodeNav;
