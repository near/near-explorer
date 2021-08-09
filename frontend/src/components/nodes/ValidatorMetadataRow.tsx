import { PureComponent } from "react";

import { Row, Col } from "react-bootstrap";

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
      <Row noGutters className="validator-nodes-content-row">
        {poolDetailsAvailable ? (
          <>
            {poolWebsite && (
              <Col className="validator-nodes-content-cell" xs="auto">
                <Row noGutters>
                  <Col className="validator-nodes-details-title">Web</Col>
                </Row>
                <Row noGutters>
                  <Col className="validator-nodes-text">
                    <a
                      href={`http://${poolWebsite}`}
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
                  <Col className="validator-nodes-details-title">Email</Col>
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
                  <Col className="validator-nodes-details-title">Twitter</Col>
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
                  <Col className="validator-nodes-details-title">Discord</Col>
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
                    Description
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
              If you are node owner feel free to fill all{" "}
              <a
                href="https://github.com/zavodil/near-pool-details#description"
                target="_blank"
              >
                data
              </a>{" "}
              to promote your own node!
            </p>
          </Col>
        )}
      </Row>
    );
  }
}

export default ValidatorMetadataRow;
