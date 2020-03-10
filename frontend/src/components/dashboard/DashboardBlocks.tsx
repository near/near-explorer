import Link from "next/link";

import React from "react";
import { Row, Col } from "react-bootstrap";

import BlocksApi from "../../libraries/explorer-wamp/blocks";

import autoRefreshHandler from "../utils/autoRefreshHandler";
import FlipMove from "../utils/FlipMove";
import PaginationSpinner from "../utils/PaginationSpinner";

import DashboardBlocksBlock from "./DashboardBlocksBlock";

import { Props } from "../blocks/Blocks";

import IconBlocks from "../../../public/static/images/icon-blocks.svg";

const count = 8;

const fetchBlocks = async () => {
  return await new BlocksApi().getLatestBlocksInfo(count);
};

class DashboardBlocks extends React.Component<Props> {
  static defaultProps = {
    items: []
  };

  render() {
    const { items } = this.props;
    let blockShow = <PaginationSpinner hidden={false} />;
    if (items.length > 0) {
      blockShow = (
        <>
          <FlipMove
            duration={1000}
            staggerDurationBy={0}
            className="row gutter-4"
          >
            {items.map(block => (
              <DashboardBlocksBlock key={block.hash} block={block} />
            ))}
          </FlipMove>
          <Row>
            <Col xs="6">
              <Link href="blocks">
                <a className="dashboard-footer">View All</a>
              </Link>
            </Col>
          </Row>
        </>
      );
    }
    return (
      <>
        <Row>
          <Col xs="1">
            <div className="dashboard-blocks-icon">
              <IconBlocks />
            </div>
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
          <Col>{blockShow}</Col>
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

export default autoRefreshHandler(DashboardBlocks, fetchBlocks, count);
