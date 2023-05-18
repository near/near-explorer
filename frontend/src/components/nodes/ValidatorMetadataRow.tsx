import * as React from "react";

import { Trans, useTranslation } from "next-i18next";
import { Col, Row } from "react-bootstrap";

import { ValidatorDescription } from "@/common/types/procedures";
import { styled } from "@/frontend/libraries/styles";

export const ValidatorNodesDetailsTitle = styled(Col, {
  display: "flex",
  flexWrap: "nowrap",
  fontSize: 12,
  color: "#a2a2a8",
});

export const ValidatorNodesContentCell = styled(Col, {
  // TODO: find out why stylesheet specificity takes bootstrap sheet over stitches sheet
  padding: "0 22px !important",
  borderRight: "1px solid #e5e5e6",

  "&:last-child": {
    borderRight: "none",
  },
});

export const ValidatorNodesContentRow = styled(Row, {
  paddingVertical: 16,
});

const ValidatorNodesText = styled(Col, {
  fontWeight: 500,
  fontSize: 14,
  color: "#3f4045",
});

type ElementProps = React.PropsWithChildren<{
  header: React.ReactNode;
}>;

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
                    rel="noreferrer"
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
