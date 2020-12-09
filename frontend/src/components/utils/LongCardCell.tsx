import { Row, Col, Spinner } from "react-bootstrap";
import Link from "next/link";
export interface Props {
  title: React.ReactElement | string;
  text: React.ReactElement | string;
  loading?: boolean;
  href?: string;
}

export default ({ title, text, loading, href }: Props) => (
  <Row className="long-card-cell" noGutters>
    <Col xs="12" md="12" className="long-card-cell-title align-self-center">
      {title}
    </Col>
    <Col xs="12" md="12" className="ml-auto card-cell-text align-self-center">
      {loading ? (
        <Spinner animation="border" variant="secondary" />
      ) : href ? (
        <Link href={href}>
          <a style={{ margin: "0" }}>
            <p
              style={{
                width: "100%",
                height: "100%",
                margin: "0",
                padding: "10px",
              }}
            >
              <img
                src="/static/images/right-arrow.svg"
                className="right-arrow"
              />
              {text}
            </p>
          </a>
        </Link>
      ) : (
        text
      )}
    </Col>

    <style jsx global>{`
      .long-card-cell {
        width: 330px;
        height: 100px;
        padding: 6px;
        margin-left: 12px;
      }
      .card-cell-text:hover {
        background: #f9f9f9;
        border-radius: 8px;
        cursor: pointer;
      }
      .long-card-cell-title {
        color: #9b9b9b;
        font-size: 14px;
        font-weight: 500;
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
        top: 0;
        left: 90%;
      }
      .card-cell .term-helper .info {
        display: none;
      }
      .card-cell:hover .term-helper .info {
        display: block;
      }
      @media (max-width: 800px) {
        .card-cell .term-helper .info {
          display: block;
        }
        .long-card-cell {
          width: 45%;
        }
      }
      @media (max-width: 400px) {
        .long-card-cell {
          width: 100%;
        }
        .card-cell-text {
          font-size: 24px;
        }
      }
    `}</style>
  </Row>
);
