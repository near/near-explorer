import Link from "next/link";

import { Component } from "react";

import { Row, Col, Card } from "react-bootstrap";

import Moment from "../utils/Moment";

class DashboardBlocksBlock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      created: props.created === undefined ? new Date() : props.created,
      createdStr: ""
    };

    this.tick = this.tick.bind(this);
  }

  componentDidMount() {
    this.timer = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  tick() {
    this.setState({
      createdStr: Moment(this.state.created).fromNow()
    });
  }

  render() {
    return (
      <Col xs="6">
        <Link href={"block/" + this.props.blockNumber}>
          <a className="dashboard-blocks-block-link">
            <Card className="dashboard-blocks-block">
              <Card.Title className="dashboard-blocks-block-title">
                #{this.props.blockNumber}
              </Card.Title>
              <Card.Body className="dashboard-blocks-block-content">
                <p className="dashboard-blocks-block-content-p">
                  {this.props.transactionsCount}
                </p>
                <p className="dashboard-blocks-block-content-p">
                  {this.props.blockHeight}
                </p>
                <p className="dashboard-blocks-block-content-p">
                  @{this.props.witness}
                </p>
                <Row noGutters="true">
                  <Col md="7" xs="7">
                    <span className="dashboard-blocks-block-content-p-footer">
                      {this.props.blockHash.substring(0, 6)}...
                    </span>
                  </Col>
                  <Col md="5" xs="5" className="align-self-center text-right">
                    <span className="dashboard-blocks-block-timer">
                      {this.state.createdStr}
                    </span>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </a>
        </Link>
        <style jsx global>{`
          .dashboard-blocks-block-link {
            cursor: pointer;
          }

          .dashboard-blocks-block-link:hover {
            text-decoration: none;
          }

          .dashboard-blocks-block {
            padding: 10px;
            border-radius: 8px;
            border: solid 4px #e6e6e6;
            margin-top: 8px;
          }

          .dashboard-blocks-block-title {
            font-family: BentonSans;
            font-size: 18px;
            font-weight: 500;
            color: #24272a;
          }

          .dashboard-blocks-block-content {
            padding: 0 !important;
          }

          .dashboard-blocks-block-content-p {
            line-height: 8px;
            font-family: BentonSans;
            font-size: 14px;
            color: #999999;
          }

          .dashboard-blocks-block-content-p-footer {
            font-family: BentonSans;
            font-size: 14px;
            font-weight: 500;
            color: #0072ce;
            margin-bottom: 0;
          }

          .dashboard-blocks-block-timer {
            font-family: BentonSans;
            font-size: 12px;
            color: #999999;
          }
        `}</style>
      </Col>
    );
  }
}

export default DashboardBlocksBlock;
