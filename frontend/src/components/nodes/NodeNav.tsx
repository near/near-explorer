import Link from "next/link";

import React from "react";
import { Row, Col } from "react-bootstrap";

import NodesApi from "../../libraries/explorer-wamp/nodes";

interface State {
  validatorsCount?: number;
  nonValidatorsCount?: number;
}

export default class extends React.Component<State> {
  constructor(props: any) {
    super(props);
    this.timer = null;
  }

  timer: ReturnType<typeof setTimeout> | null;
  state: State = {};

  componentDidMount() {
    this.timer = setTimeout(this.regularFetchInfo, 0);
  }

  componentWillUnmount() {
    const timer = this.timer;
    this.timer = null;
    if (timer !== null) {
      clearTimeout(timer);
    }
  }

  regularFetchInfo = async () => {
    await this.fetchNodes();
    if (this.timer !== null) {
      this.timer = setTimeout(this.regularFetchInfo, 10000);
    }
  };

  fetchNodes = async () => {
    const [
      validatorsCount,
      nonValidatorsCount,
    ] = await new NodesApi().getTotalValidatorsAndOther();
    this.setState({ validatorsCount, nonValidatorsCount });
  };

  render() {
    const { validatorsCount, nonValidatorsCount } = this.state;
    return (
      <>
        <Row>
          <Link href="/nodes/[role]" as={`/nodes/validators`}>
            <a style={{ textDecoration: "none", marginLeft: "15px" }}>
              <Col className="node-selector pagination-total align-self-center">
                <img
                  src={"/static/images/icon-m-node-validator-status.svg"}
                  style={{ width: "12px", marginRight: "10px" }}
                />
                {validatorsCount ? `${validatorsCount}  VALIDATOR NODES` : `-`}
              </Col>
            </a>
          </Link>
          <Link href="/nodes/[role]" as={`/nodes/non-validators`}>
            <a style={{ textDecoration: "none", marginLeft: "15px" }}>
              <Col className="node-selector pagination-total align-self-center">
                <img
                  src={"/static/images/icon-m-node-non-validator-status.svg"}
                  style={{ width: "12px", marginRight: "10px" }}
                />
                {nonValidatorsCount
                  ? `${nonValidatorsCount}  NON-VALIDATOR NODES`
                  : `-`}
              </Col>
            </a>
          </Link>
        </Row>
        <style jsx global>{`
          .pagination-total {
            font-size: 12px;
            font-weight: 500;
            letter-spacing: 1.38px;
            color: #24272a;
            text-transform: uppercase;
            margin: 0 0.5em 1.5em;
            padding: 8px;
          }

          .node-selector {
            text-align: center;
            background: #fff;
            border: 2px solid #e6e6e6;
            box-sizing: border-box;
            border-radius: 25px;
            margin-left: 15px;
          }
        `}</style>
      </>
    );
  }
}
