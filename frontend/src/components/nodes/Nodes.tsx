import { Component } from "react";

import * as N from "../../libraries/explorer-wamp/nodes";
import { NodeConsumer } from "../../context/NodeProvider";

import { onPageChange as P } from "../utils/Pagination";
import { Table } from "../utils/Table";

import NodeRow from "./NodeRow";
import PaginationSpinner from "../utils/PaginationSpinner";

import { Translate } from "react-localize-redux";

const itemsPerPage = 10;
class Nodes extends Component {
  state = {
    activePage: 0,
    startPage: 1,
    endPage: itemsPerPage,
  };

  onPageChange = ({ selected }: P) => {
    this.setState({
      activePage: selected,
      startPage: selected * itemsPerPage + 1,
      endPage: selected * itemsPerPage + itemsPerPage,
    });
  };
  render() {
    const { activePage, startPage, endPage } = this.state;
    return (
      <Translate>
        {({ translate }) => (
          <NodeConsumer>
            {(context) => (
              <>
                {context.onlineNodes ? (
                  <Table
                    className="online-nodes-section"
                    pagination={{
                      className: "online-nodes-pagination",
                      pageCount: Math.ceil(
                        context.onlineNodes.length / itemsPerPage
                      ),
                      marginPagesDisplayed: 1,
                      pageRangeDisplayed: 3,
                      onPageChange: this.onPageChange,
                    }}
                  >
                    <thead>
                      <tr className="online-nodes-header-row">
                        <th />
                        <th>#</th>
                        <th>{translate("component.nodes.Nodes.validator")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {context.onlineNodes
                        .slice(startPage - 1, endPage)
                        .map((node: N.NodeInfo, index: number) => (
                          <NodeRow
                            key={node.nodeId}
                            node={node}
                            index={activePage * itemsPerPage + index + 1}
                          />
                        ))}
                    </tbody>
                  </Table>
                ) : (
                  <PaginationSpinner hidden={false} />
                )}
              </>
            )}
          </NodeConsumer>
        )}
      </Translate>
    );
  }
}

export default Nodes;
