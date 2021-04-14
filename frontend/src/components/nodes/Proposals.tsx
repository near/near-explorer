import React from "react";

import { NodeConsumer } from "../../context/NodeProvider";

import { onPageChange as P } from "../utils/Pagination";
import { Table } from "../utils/Table";

import ProposalList from "./PoposalList";
import PaginationSpinner from "../utils/PaginationSpinner";

const itemsPerPage = 10;
class Proposals extends React.Component {
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
      <>
        <NodeConsumer>
          {(context) => (
            <>
              {context.proposals ? (
                <Table
                  className="proposals-section"
                  pagination={{
                    className: "proposals-pagination",
                    pageCount: Math.ceil(
                      context.proposals.length / itemsPerPage
                    ),
                    marginPagesDisplayed: 1,
                    pageRangeDisplayed: 3,
                    onPageChange: this.onPageChange,
                  }}
                >
                  <thead>
                    <tr className="proposals-header-row">
                      <th />
                      <th>#</th>
                      <th>Validator</th>
                      <th className="text-right">Stake</th>
                      <th>Cumulative Stake</th>
                    </tr>
                  </thead>
                  <tbody>
                    <ProposalList
                      proposals={context.proposals}
                      pages={{
                        startPage,
                        endPage,
                        activePage,
                        itemsPerPage,
                      }}
                    />
                  </tbody>
                </Table>
              ) : (
                <PaginationSpinner hidden={false} />
              )}
            </>
          )}
        </NodeConsumer>
        <style global jsx>{`
          .proposals-section {
            margin-top: 24px;
          }
        `}</style>
      </>
    );
  }
}

export default Proposals;
