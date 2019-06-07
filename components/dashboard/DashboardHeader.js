import Link from "next/link";

import { Row, Col, Card, CardGroup } from "react-bootstrap";

const DashboardCard = props => (
  <Card
    className={`text-center ${props.cls}`}
    style={{ border: "solid 4px #e6e6e6" }}
  >
    <Card.Body>
      <Card.Title className="dashboard-card-title">
        <img src={props.imgLink} className="dashboard-card-title-img" />
        {props.title}
      </Card.Title>
      <Card.Text className="dashboard-card-text">
        {props.format !== undefined
          ? parseInt(props.text).toLocaleString()
          : props.text}
      </Card.Text>
    </Card.Body>
    <style jsx global>{`
      .dashboard-card-title {
        text-transform: uppercase;
        letter-spacing: 1.8px;
        color: #999999;
        font-family: BentonSans;
        font-size: 14px;
        font-weight: 500;
      }

      .dashboard-card-title-img {
        width: 12px !important;
        margin-right: 8px;
      }

      .dashboard-card-text {
        font-family: BwSeidoRound;
        font-size: 24px;
        font-weight: 500;
        color: #24272a;
        margin-top: -10px;
      }
    `}</style>
  </Card>
);

const DashboardHeader = () => (
  <Row>
    <Col>
      <CardGroup>
        <DashboardCard
          title="Nodes Online"
          imgLink="/static/images/icon-m-node-online.svg"
          text="1162/2356"
          cls="border-right-0"
        />
        <DashboardCard
          title="Block Height"
          imgLink="/static/images/icon-m-height.svg"
          text="6083793"
          cls="border-right-0"
          format="true"
        />
        <DashboardCard
          title="Tps/Max"
          imgLink="/static/images/icon-m-tps.svg"
          text="27/748"
          cls="border-right-0"
        />
        <DashboardCard
          title="Last Day Tx"
          imgLink="/static/images/icon-m-transaction.svg"
          text="2477500"
          cls="border-right-0"
          format="true"
        />
        <Link href="accounts">
          <a>
            <DashboardCard
              title="Accounts"
              imgLink="/static/images/icon-m-user.svg"
              text="2113478"
              format="true"
              cls="pr-0"
            />
          </a>
        </Link>
      </CardGroup>
    </Col>
  </Row>
);

export default DashboardHeader;
