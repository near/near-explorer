import * as React from "react";

import { Col, Row } from "react-bootstrap";
import { Trans, useTranslation } from "react-i18next";
import { styled } from "../../libraries/styles";
import { ValidatorDescription } from "../../types/common";
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
  description?: ValidatorDescription;
}

const ValidatorMetadataRow: React.FC<Props> = React.memo(({ description }) => {
  const { t } = useTranslation();

  if (!description) {
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
        {description.url && (
          <a
            href={
              description.url.startsWith("http")
                ? description.url
                : `http://${description.url}`
            }
            rel="noreferrer noopener"
            target="_blank"
          >
            {description.url}
          </a>
        )}
      </ValidatorMetadataElement>
      <ValidatorMetadataElement
        header={t("component.nodes.ValidatorMetadataRow.pool_info.email")}
      >
        {description.email && (
          <a href={`mailto:${description.email}`}>{description.email}</a>
        )}
      </ValidatorMetadataElement>
      <ValidatorMetadataElement
        header={t("component.nodes.ValidatorMetadataRow.pool_info.twitter")}
      >
        {description.twitter && (
          <a
            href={`https://twitter.com/${description.twitter}`}
            rel="noreferrer noopener"
            target="_blank"
          >
            {description.twitter}
          </a>
        )}
      </ValidatorMetadataElement>
      <ValidatorMetadataElement
        header={t("component.nodes.ValidatorMetadataRow.pool_info.discord")}
      >
        {description.discord && (
          <a
            href={description.discord}
            rel="noreferrer noopener"
            target="_blank"
          >
            {description.discord}
          </a>
        )}
      </ValidatorMetadataElement>
      <ValidatorMetadataElement
        header={t("component.nodes.ValidatorMetadataRow.pool_info.description")}
      >
        {description.description && <small>{description.description}</small>}
      </ValidatorMetadataElement>
    </ValidatorNodesContentRow>
  );
});

export default ValidatorMetadataRow;
