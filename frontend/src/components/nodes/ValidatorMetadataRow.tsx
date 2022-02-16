import { FC } from "react";

import { Col, Row } from "react-bootstrap";
import { Trans, useTranslation } from "react-i18next";
import { styled } from "../../libraries/styles";
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
  poolWebsite?: string;
  poolEmail?: string;
  poolTwitter?: string;
  poolDiscord?: string;
  poolDescription?: string;
}

const ValidatorMetadataRow: FC<Props> = ({
  poolWebsite,
  poolEmail,
  poolTwitter,
  poolDiscord,
  poolDescription,
}) => {
  const { t } = useTranslation();
  const poolDetailsAvailable =
    Boolean(poolWebsite) ||
    Boolean(poolEmail) ||
    Boolean(poolTwitter) ||
    Boolean(poolDiscord) ||
    Boolean(poolDescription);

  return (
    <ValidatorNodesContentRow noGutters>
      {poolDetailsAvailable ? (
        <>
          {poolWebsite && (
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
                      poolWebsite.startsWith("http")
                        ? poolWebsite
                        : `http://${poolWebsite}`
                    }
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    {poolWebsite}
                  </a>
                </ValidatorNodesText>
              </Row>
            </ValidatorNodesContentCell>
          )}
          {poolEmail && (
            <ValidatorNodesContentCell xs="auto">
              <Row noGutters>
                <ValidatorNodesDetailsTitle>
                  {t("component.nodes.ValidatorMetadataRow.pool_info.email")}
                </ValidatorNodesDetailsTitle>
              </Row>
              <Row noGutters>
                <ValidatorNodesText>
                  <a href={`mailto:${poolEmail}`}>{poolEmail}</a>
                </ValidatorNodesText>
              </Row>
            </ValidatorNodesContentCell>
          )}
          {poolTwitter && (
            <ValidatorNodesContentCell xs="auto">
              <Row noGutters>
                <ValidatorNodesDetailsTitle>
                  {t("component.nodes.ValidatorMetadataRow.pool_info.twitter")}
                </ValidatorNodesDetailsTitle>
              </Row>
              <Row noGutters>
                <ValidatorNodesText>
                  <a
                    href={`https://twitter.com/${poolTwitter}`}
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    {poolTwitter}
                  </a>
                </ValidatorNodesText>
              </Row>
            </ValidatorNodesContentCell>
          )}
          {poolDiscord && (
            <ValidatorNodesContentCell xs="auto">
              <Row noGutters>
                <ValidatorNodesDetailsTitle>
                  {t("component.nodes.ValidatorMetadataRow.pool_info.discord")}
                </ValidatorNodesDetailsTitle>
              </Row>
              <Row noGutters>
                <ValidatorNodesText>
                  <a
                    href={poolDiscord}
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    {poolDiscord}
                  </a>
                </ValidatorNodesText>
              </Row>
            </ValidatorNodesContentCell>
          )}
          {poolDescription && (
            <ValidatorNodesContentCell>
              <Row noGutters>
                <ValidatorNodesDetailsTitle>
                  {t(
                    "component.nodes.ValidatorMetadataRow.pool_info.description"
                  )}
                </ValidatorNodesDetailsTitle>
              </Row>
              <Row noGutters>
                <ValidatorNodesText>
                  <small>{poolDescription}</small>
                </ValidatorNodesText>
              </Row>
            </ValidatorNodesContentCell>
          )}
        </>
      ) : (
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
      )}
    </ValidatorNodesContentRow>
  );
};

export default ValidatorMetadataRow;
