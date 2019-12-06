import React from "react";

import Link from "next/link";

import { Row, Col } from "react-bootstrap";

import IconBlocks from "../../../public/static/images/icon-blocks.svg";

import DashboardBlocksBlock from "./DashboardBlocksBlock";

import BlocksApi from "../../libraries/explorer-wamp/blocks";
import FlipMove from "react-flip-move";

export default class extends React.Component {
  state = {
    blocks: this.props.blocks
  };

  componentDidMount() {
    this.regularFetchInfo();
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    this.timer = null;
  }

  fetchInfo = async () => {
    const blocks = await new BlocksApi()
      .getLatestBlocksInfo(8)
      .catch(() => null);
    this.setState({ blocks });
  };

  regularFetchInfo = async () => {
    await this.fetchInfo();
    if (this.timer !== null) {
      this.timer = setTimeout(this.regularFetchInfo, 10000);
    }
  };
  render() {
    const { blocks } = this.state;
    return (
      <>
        <Row>
          <Col xs="1">
            <IconBlocks className="dashboard-blocks-icon" />
          </Col>
          <Col className="dashboard-blocks-title">
            <h2>Recent Blocks</h2>
          </Col>
        </Row>
        <Row>
          <Col xs="1">
            <div className="dashboard-blocks-hr-parent">
              <div className="dashboard-blocks-hr" />
            </div>
          </Col>
          <Col>
            <FlipMove
              duration={1000}
              staggerDurationBy={0}
              className="row gutter-4"
            >
              {blocks.map(block => (
                <DashboardBlocksBlock
                  key={block.hash}
                  blockHash={block.hash}
                  blockHeight={block.height}
                  blockTimestamp={block.timestamp}
                  transactionsCount={block.transactionsCount}
                />
              ))}
            </FlipMove>
            <Row>
              <Col xs="6">
                <Link href="blocks">
                  <a className="dashboard-footer">View All</a>
                </Link>
              </Col>
            </Row>
          </Col>
        </Row>
        <style jsx global>{`
          .dashboard-blocks-icon {
            width: 22px;
            margin-top: 6px;
          }

          .dashboard-blocks-icon g {
            stroke: #aaa;
          }

          .dashboard-blocks-hr-parent {
            width: 26px;
            height: 100%;
          }

          .dashboard-blocks-hr {
            border: solid 3px #f8f8f8;
            width: 1px;
            height: 100%;
            margin: 0 auto;
          }

          .dashboard-footer {
            width: 100px;
            background-color: #f8f8f8;
            display: block;
            text-align: center;
            text-decoration: none;
            font-family: BentonSans;
            font-size: 14px;
            color: #0072ce;
            font-weight: bold;
            text-transform: uppercase;
            margin-top: 20px;
            border-radius: 30px;
            padding: 8px 0;
          }

          .gutter-4.row {
            margin-right: -4px;
            margin-left: -4px;
          }
          .gutter-4 > [class^="col-"],
          .gutter-4 > [class^=" col-"] {
            padding-right: 4px;
            padding-left: 4px;
          }
        `}</style>
      </>
    );
  }
}
