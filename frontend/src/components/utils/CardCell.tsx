import { Row, Col, Card, Spinner } from "react-bootstrap";
import { styled } from "../../libraries/styles";
import { TermInfoIcon } from "./Term";

export const CardCellWrapper = styled(Card, {
  borderStyle: "solid",
  borderColor: "#e6e6e6",
  borderWidth: "0 0 0 2px",
  borderRadius: 0,
  height: "100%",

  "& a": {
    fontWeight: 500,
    color: "#6ad1e3",
    textDecoration: "none !important",
  },
  "& a:hover": {
    color: "#6ad1e3",
  },
  [`& ${TermInfoIcon}`]: {
    display: "none",
  },
  [`&:hover ${TermInfoIcon}`]: {
    display: "block",
  },
});

const CardCellTitle = styled(Col, {
  textTransform: "uppercase",
  letterSpacing: 1.8,
  color: "#999999",
  fontSize: 14,
  fontWeight: 500,
});

export const CardCellTitleImage = styled("img", {
  width: "12px !important",
  marginRight: 8,
  marginTop: -3,
});

export const CardCellText = styled(Col, {
  fontSize: 18,
  fontWeight: 500,
  color: "#24272a",
});

export interface Props {
  className?: string;
  title: React.ReactElement | string;
  imgLink?: string;
  text: React.ReactElement | string;
  loading?: boolean;
}

const CardCell = ({ title, imgLink, text, className, loading }: Props) => (
  <CardCellWrapper className={className}>
    <Card.Body>
      <Row noGutters>
        <CardCellTitle xs="auto" md="12" className="align-self-center">
          {imgLink && <CardCellTitleImage src={imgLink} />}
          {title}
        </CardCellTitle>
        <CardCellText xs="auto" md="12" className="ml-auto align-self-center">
          {loading ? <Spinner animation="border" variant="secondary" /> : text}
        </CardCellText>
      </Row>
    </Card.Body>
  </CardCellWrapper>
);

export default CardCell;
