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
      {poolDetails.url && (
        <ValidatorNodesContentCell xs="auto">
          <Row noGutters>
            <ValidatorNodesDetailsTitle>
              {t("component.nodes.ValidatorMetadataRow.pool_info.website")}
            </ValidatorNodesDetailsTitle>
          </Row>
          <Row noGutters>
            <ValidatorNodesText>
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
            </ValidatorNodesText>
          </Row>
        </ValidatorNodesContentCell>
      )}
      {poolDetails.email && (
        <ValidatorNodesContentCell xs="auto">
          <Row noGutters>
            <ValidatorNodesDetailsTitle>
              {t("component.nodes.ValidatorMetadataRow.pool_info.email")}
            </ValidatorNodesDetailsTitle>
          </Row>
          <Row noGutters>
            <ValidatorNodesText>
              <a href={`mailto:${poolDetails.email}`}>{poolDetails.email}</a>
            </ValidatorNodesText>
          </Row>
        </ValidatorNodesContentCell>
      )}
      {poolDetails.twitter && (
        <ValidatorNodesContentCell xs="auto">
          <Row noGutters>
            <ValidatorNodesDetailsTitle>
              {t("component.nodes.ValidatorMetadataRow.pool_info.twitter")}
            </ValidatorNodesDetailsTitle>
          </Row>
          <Row noGutters>
            <ValidatorNodesText>
              <a
                href={`https://twitter.com/${poolDetails.twitter}`}
                rel="noreferrer noopener"
                target="_blank"
              >
                {poolDetails.twitter}
              </a>
            </ValidatorNodesText>
          </Row>
        </ValidatorNodesContentCell>
      )}
      {poolDetails.discord && (
        <ValidatorNodesContentCell xs="auto">
          <Row noGutters>
            <ValidatorNodesDetailsTitle>
              {t("component.nodes.ValidatorMetadataRow.pool_info.discord")}
            </ValidatorNodesDetailsTitle>
          </Row>
          <Row noGutters>
            <ValidatorNodesText>
              <a
                href={poolDetails.discord}
                rel="noreferrer noopener"
                target="_blank"
              >
                {poolDetails.discord}
              </a>
            </ValidatorNodesText>
          </Row>
        </ValidatorNodesContentCell>
      )}
      {poolDetails.description && (
        <ValidatorNodesContentCell>
          <Row noGutters>
            <ValidatorNodesDetailsTitle>
              {t("component.nodes.ValidatorMetadataRow.pool_info.description")}
            </ValidatorNodesDetailsTitle>
          </Row>
          <Row noGutters>
            <ValidatorNodesText>
              <small>{poolDetails.description}</small>
            </ValidatorNodesText>
          </Row>
        </ValidatorNodesContentCell>
      )}
    </ValidatorNodesContentRow>
  );
});

export default ValidatorMetadataRow;
