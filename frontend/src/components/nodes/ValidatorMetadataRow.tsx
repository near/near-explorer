import * as React from "react";

import { Col, Row } from "react-bootstrap";
import { Trans, useTranslation } from "react-i18next";
import { styled } from "../../libraries/styles";
import { PoolDetails } from "../../libraries/wamp/types";
import {
  ValidatorNodesContentCell,
  ValidatorNodesContentRow,
  ValidatorNodesDetailsTitle,
} from "./ValidatorRow";

const ValidatorNodesText = styled(Col, {
  fontWeight: 500,
  fontSize: 14,
  color: "#3f4045",
});

type ElementProps = {
  header: React.ReactNode;
};

const ValidatorMetadataElement: React.FC<ElementProps> = React.memo(
  ({ children, header }) => {
    if (!children) {
      return null;
    }
    return (
      <ValidatorNodesContentCell xs="auto">
        <Row noGutters>
          <ValidatorNodesDetailsTitle>{header}</ValidatorNodesDetailsTitle>
        </Row>
        <Row noGutters>
          <ValidatorNodesText>{children}</ValidatorNodesText>
        </Row>
      </ValidatorNodesContentCell>
    );
  }
);

interface Props {
  poolDetails?: PoolDetails;
}

const ValidatorMetadataRow: React.FC<Props> = React.memo(({ poolDetails }) => {
  const { t } = useTranslation();

  if (!poolDetails) {
    return (
      <ValidatorNodesContentRow noGutters>
        <ValidatorNodesContentCell>
          <p className="text-center">
            <Trans
              t={t}
              i18nKey="component.nodes.ValidatorMetadataRow.pool_info_tip"
              components={{
                poolLink: (
                  <a
                    href="https://github.com/zavodil/near-pool-details#description"
                    target="_blank"
                  />
                ),
              }}
            />
          </p>
        </ValidatorNodesContentCell>
      </ValidatorNodesContentRow>
    );
  }

  return (
    <ValidatorNodesContentRow noGutters>
      <ValidatorMetadataElement
        header={t("component.nodes.ValidatorMetadataRow.pool_info.website")}
      >
        {poolDetails.url && (
          <a
            href={
              poolDetails.url.startsWith("http")
                ? poolDetails.url
                : `http://${poolDetails.url}`
            }
            rel="noreferrer noopener"
            target="_blank"
          >
            {poolDetails.url}
          </a>
        )}
      </ValidatorMetadataElement>
      <ValidatorMetadataElement
        header={t("component.nodes.ValidatorMetadataRow.pool_info.email")}
      >
        {poolDetails.email && (
          <a href={`mailto:${poolDetails.email}`}>{poolDetails.email}</a>
        )}
      </ValidatorMetadataElement>
      <ValidatorMetadataElement
        header={t("component.nodes.ValidatorMetadataRow.pool_info.twitter")}
      >
        {poolDetails.twitter && (
          <a
            href={`https://twitter.com/${poolDetails.twitter}`}
            rel="noreferrer noopener"
            target="_blank"
          >
            {poolDetails.twitter}
          </a>
        )}
      </ValidatorMetadataElement>
      <ValidatorMetadataElement
        header={t("component.nodes.ValidatorMetadataRow.pool_info.discord")}
      >
        {poolDetails.discord && (
          <a
            href={poolDetails.discord}
            rel="noreferrer noopener"
            target="_blank"
          >
            {poolDetails.discord}
          </a>
        )}
      </ValidatorMetadataElement>
      <ValidatorMetadataElement
        header={t("component.nodes.ValidatorMetadataRow.pool_info.description")}
      >
        {poolDetails.description && <small>{poolDetails.description}</small>}
      </ValidatorMetadataElement>
    </ValidatorNodesContentRow>
  );
});

export default ValidatorMetadataRow;
