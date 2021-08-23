import { PureComponent } from "react";

import { Row, Col } from "react-bootstrap";
import { Translate } from "react-localize-redux";

interface Props {
  poolWebsite?: string;
  poolEmail?: string;
  poolTwitter?: string;
  poolDiscord?: string;
  poolDescription?: string;
}

class ValidatorMetadataRow extends PureComponent<Props> {
  render() {
    const {
      poolWebsite,
      poolEmail,
      poolTwitter,
      poolDiscord,
      poolDescription,
    } = this.props;

    const poolDetailsAvailable =
      Boolean(poolWebsite) ||
      Boolean(poolEmail) ||
      Boolean(poolTwitter) ||
      Boolean(poolDiscord) ||
      Boolean(poolDescription);

    return (
      <Translate>
        {({ translate }) => (
          <Row noGutters className="validator-nodes-content-row">
            {poolDetailsAvailable ? (
              <>
                {poolWebsite && (
                  <Col className="validator-nodes-content-cell" xs="auto">
                    <Row noGutters>
                      <Col className="validator-nodes-details-title">
                        {translate(
                          "component.nodes.ValidatorMetadataRow.pool_info.website"
                        )}
                      </Col>
                    </Row>
                    <Row noGutters>
                      <Col className="validator-nodes-text">
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
                      </Col>
                    </Row>
                  </Col>
                )}
                {poolEmail && (
                  <Col className="validator-nodes-content-cell" xs="auto">
                    <Row noGutters>
                      <Col className="validator-nodes-details-title">
                        {translate(
                          "component.nodes.ValidatorMetadataRow.pool_info.email"
                        )}
                      </Col>
                    </Row>
                    <Row noGutters>
                      <Col className="validator-nodes-text">
                        <a href={`mailto:${poolEmail}`}>{poolEmail}</a>
                      </Col>
                    </Row>
                  </Col>
                )}
                {poolTwitter && (
                  <Col className="validator-nodes-content-cell" xs="auto">
                    <Row noGutters>
                      <Col className="validator-nodes-details-title">
                        {translate(
                          "component.nodes.ValidatorMetadataRow.pool_info.twitter"
                        )}
                      </Col>
                    </Row>
                    <Row noGutters>
                      <Col className="validator-nodes-text">
                        <a
                          href={`https://twitter.com/${poolTwitter}`}
                          rel="noreferrer noopener"
                          target="_blank"
                        >
                          {poolTwitter}
                        </a>
                      </Col>
                    </Row>
                  </Col>
                )}
                {poolDiscord && (
                  <Col className="validator-nodes-content-cell" xs="auto">
                    <Row noGutters>
                      <Col className="validator-nodes-details-title">
                        {translate(
                          "component.nodes.ValidatorMetadataRow.pool_info.discord"
                        )}
                      </Col>
                    </Row>
                    <Row noGutters>
                      <Col className="validator-nodes-text">
                        <a
                          href={poolDiscord}
                          rel="noreferrer noopener"
                          target="_blank"
                        >
                          {poolDiscord}
                        </a>
                      </Col>
                    </Row>
                  </Col>
                )}
                {poolDescription && (
                  <Col className="validator-nodes-content-cell">
                    <Row noGutters>
                      <Col className="validator-nodes-details-title">
                        {translate(
                          "component.nodes.ValidatorMetadataRow.pool_info.description"
                        )}
                      </Col>
                    </Row>
                    <Row noGutters>
                      <Col className="validator-nodes-text">
                        <small>{poolDescription}</small>
                      </Col>
                    </Row>
                  </Col>
                )}
              </>
            ) : (
              <Col className="validator-nodes-content-cell">
                <p className="text-center">
                  {translate(
                    "component.nodes.ValidatorMetadataRow.pool_info_tip.text",
                    {
                      pool_info_url: (
                        <a
                          href="https://github.com/zavodil/near-pool-details#description"
                          target="_blank"
                        >
                          {translate(
                            "component.nodes.ValidatorMetadataRow.pool_info_tip.url_text"
                          )}
                        </a>
                      ),
                    }
                  )}
                </p>
              </Col>
            )}
          </Row>
        )}
      </Translate>
    );
  }
}

export default ValidatorMetadataRow;
