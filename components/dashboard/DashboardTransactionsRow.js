import { Component } from "react";

import { Row, Col } from "react-bootstrap";

import * as moment from "moment";

const TransactionImage = {
  Call: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 18 18"
    >
      <path
        fill="#999"
        fillRule="evenodd"
        d="M0 9l6 6L9 0 0 9zm9 9l9-9-6-6-3 15z"
      />
    </svg>
  ),
  Sent: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 12 12"
    >
      <path fill="#8FD6BD" fillRule="evenodd" d="M6 0v6L0 0v12l6-6v6l6-6z" />
    </svg>
  ),
  Staked: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 12 12"
    >
      <g fill="#4A4F54" fillRule="evenodd">
        <path d="M3 6c0-2.22.604-4.153 1.5-5.19C4.058.296 3.547 0 3 0 1.343 0 0 2.686 0 6s1.343 6 3 6c.547 0 1.058-.297 1.5-.81C3.604 10.154 3 8.22 3 6M12 6c0 3.314-1.343 6-3 6S6 9.314 6 6s1.343-6 3-6 3 2.686 3 6" />
      </g>
    </svg>
  ),
  ContractDeployed: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 12 12"
    >
      <path fill="#F0EC74" fillRule="evenodd" d="M0 0v12h12V4H8V0z" />
    </svg>
  )
};

moment.relativeTimeThreshold("ss", 1);
moment.updateLocale("en", {
  relativeTime: {
    past: input => {
      return input === "just now" ? input : input + " ago";
    },
    s: "just now",
    future: "in %s",
    ss: "%ds",
    m: "1m",
    mm: "%dm",
    h: "1hr",
    hh: "%dhr",
    d: "1d",
    dd: "%dd",
    M: "1m",
    MM: "%dm",
    y: "1y",
    yy: "%dy"
  }
});

class DashboardTransactionRow extends Component {
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
      createdStr: moment(this.state.created).fromNow()
    });
  }

  render() {
    return (
      <Row noGutters="true">
        <Col xs="1" md="1">
          <div className="dashboard-transaction-row-img">
            {TransactionImage[this.props.txType]}
          </div>
        </Col>
        <Col className="dashboard-transaction-row pl-0" xs="11" md="11">
          <Row noGutters="true">
            <Col xs="8">
              <Row>
                <Col className="dashboard-transaction-row-title">
                  {this.props.txType}: {this.props.txMsg}
                </Col>
              </Row>
              <Row>
                <Col className="dashboard-transaction-row-content">
                  {this.props.contractName} by @{this.props.username}
                </Col>
              </Row>
            </Col>
            <Col className="ml-auto text-right" xs="3" md="auto">
              <Row>
                <Col className="dashboard-transaction-txid d-none d-sm-block">
                  {this.props.txId.substring(0, 7)}...
                </Col>
              </Row>
              <Row>
                <Col className="dashboard-transaction-timer">
                  {this.state.createdStr}
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        <style jsx global>{`
          .dashboard-transaction-row {
            border-bottom: 2px solid #f8f8f8;
            margin-bottom: 15px;
            padding-bottom: 8px;
          }

          .dashboard-transaction-row-img {
            width: 24px;
            height: 24px;
            border: solid 2px #f8f8f8;
            background-color: #ffffff;
            border-radius: 50%;
            margin-right: 8px;
            text-align: center;
            line-height: 1.1;
          }

          .dashboard-transaction-row-title {
            font-family: BentonSans;
            font-size: 14px;
            font-weight: 500;
            color: #24272a;
          }

          .dashboard-transaction-row-content {
            font-family: BentonSans;
            font-size: 12px;
            font-weight: 500;
            color: #999999;
          }

          .dashboard-transaction-txid {
            font-family: BentonSans;
            font-size: 14px;
            font-weight: 500;
            color: #0072ce;
          }

          .dashboard-transaction-timer {
            font-family: BentonSans;
            font-size: 12px;
            font-weight: 500;
            color: #999999;
          }
        `}</style>
      </Row>
    );
  }
}

export default DashboardTransactionRow;
