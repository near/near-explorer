import { Row, Col, Spinner } from "react-bootstrap";
import Link from "next/link";
export interface Props {
  title: React.ReactElement | string;
  text: React.ReactElement | string;
  loading?: boolean;
  href?: string;
}

export default ({ title, text, loading, href }: Props) => {
  const plainCell = (
    <Row>
      <Col xs="12" className="long-card-cell-title align-self-center">
        {title}
      </Col>
      <Col xs="12" md="12" className="ml-auto card-cell-text align-self-center">
        {loading ? <Spinner animation="border" variant="secondary" /> : text}
      </Col>
    </Row>
  );
  return (
    <>
      {href ? (
        <Link href={href}>
          <a>
            <Row className="long-card-cell href-cell" noGutters>
              <Col>{plainCell}</Col>
              <Col xs="auto" className="right-arrow">
                <img src="/static/images/right-arrow.svg" />
              </Col>
            </Row>
          </a>
        </Link>
      ) : (
        <Row className="long-card-cell" noGutters>
          <Col>{plainCell}</Col>
        </Row>
      )}
      <style jsx global>{`
        .long-card-cell {
          padding: 13px 10px;
          margin: 6px 0;
        }

        .href-cell:hover {
          background: #f9f9f9;
          border-radius: 8px;
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
          color: #25272a;
        }

        .card-cell-text a {
          color: #00c08b;
        }

        .card-cell-text a:hover {
          color: #0072ce;
        }

        .right-arrow {
          margin: auto 0;
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
        }
      `}</style>
    </>
  );
};
