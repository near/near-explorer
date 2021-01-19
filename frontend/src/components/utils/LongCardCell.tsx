import { Row, Col, Spinner } from "react-bootstrap";
import Link from "next/link";
export interface Props {
  title: React.ReactElement | string;
  text: React.ReactElement | string;
  loading?: boolean;
  href?: string;
}

export default ({ title, text, loading, href }: Props) => (
  <>
    {href ? (
      <Row className="long-card-cell href-cell" noGutters>
        <Col xs="12" md="12" className="long-card-cell-title align-self-center">
          {title}
        </Col>
        <Col
          xs="12"
          md="12"
          className="ml-auto card-cell-text align-self-center"
        >
          {loading ? (
            <Spinner animation="border" variant="secondary" />
          ) : (
            <Link href={href}>
              <a>
                <p>
                  <img
                    src="/static/images/right-arrow.svg"
                    className="right-arrow"
                  />
                  {text}
                </p>
              </a>
            </Link>
          )}
        </Col>
      </Row>
    ) : (
      <Row className="long-card-cell" noGutters>
        <Col xs="12" md="12" className="long-card-cell-title align-self-center">
          {title}
        </Col>
        <Col
          xs="12"
          md="12"
          className="ml-auto card-cell-text align-self-center"
        >
          {loading ? <Spinner animation="border" variant="secondary" /> : text}
        </Col>
      </Row>
    )}
    <style jsx global>{`
      .long-card-cell {
        width: 330px;
        height: 87px;
        padding: 6px;
        margin-left: 12px;
      }

      .href-cell:hover {
        background: #f9f9f9;
        border-radius: 8px;
        cursor: pointer;
      }

      .long-card-cell-title {
        color: #9b9b9b;
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 5px;
      }

      .card-cell-text {
        font-weight: 900;
        font-size: 31px;
        line-height: 38px;
        color: #25272a;
      }

      .card-cell-text a {
        color: #00c08b;
      }

      .card-cell-text a:hover {
        color: #0072ce;
      }

      .right-arrow {
        position: relative;
        top: -2px;
        left: 90%;
      }

      @media (max-width: 744px) {
        .long-card-cell {
          width: 100%;
        }
      }
      @media (max-width: 415px) {
        .long-card-cell {
          width: 100%;
        }

        .card-cell-text {
          font-size: 25px;
        }

        .right-arrow {
          left: 70%;
        }
      }
    `}</style>
  </>
);
