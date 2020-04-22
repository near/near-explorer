import Link from "next/link";

import { Col } from "react-bootstrap";

export default (props) => {
  let link = (
    <a href={props.link} className="header-nav-link">
      <img src={props.imgLink} className="header-icon" />
      <span className="header-nav-item">{props.text}</span>
    </a>
  );
  if (!props.link.startsWith("http")) {
    link = <Link href={props.link}>{link}</Link>;
  }
  return (
    <Col
      className={`align-self-center d-none d-sm-block ${
        props.cls !== undefined ? props.cls : ""
      }`}
      md="auto"
    >
      {link}

      <style jsx global>{`
        .header-nav-link {
          text-decoration: none;
        }

        .header-nav-link:hover {
          text-decoration: none;
        }

        .header-icon {
          width: 20px !important;
          margin-right: 8px;
        }

        .header-nav-item {
          color: #ffffff;
          letter-spacing: 2px;
          text-decoration: none;
          text-transform: uppercase;
          font-family: BentonSans;
          font-size: 14px;
          font-weight: 500;
        }
      `}</style>
    </Col>
  );
};
