import React from "react";

import { NodeConsumer } from "../../context/NodeProvider";

import { onPageChange as P } from "../utils/Pagination";
import { Table } from "../utils/Table";

import ValidatorsList from "./ValidatorsList";
import PaginationSpinner from "../utils/PaginationSpinner";

const itemsPerPage = 12;
class Validators extends React.Component {
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
              {context.validators ? (
                <Table
                  className="validators-section"
                  pagination={{
                    className: "validators-node-pagination",
                    pageCount: Math.ceil(
                      context.validators.length / itemsPerPage
                    ),
                    marginPagesDisplayed: 1,
                    pageRangeDisplayed: 3,
                    onPageChange: this.onPageChange,
                  }}
                >
                  <thead>
                    <tr className="validators-header-row">
                      <th />
                      <th>#</th>
                      <th>Location</th>
                      <th>Validator</th>
                      <th>Fee</th>
                      <th>Delegators</th>
                      <th className="text-right">Stake</th>
                      <th>Cumulative Stake</th>
                    </tr>
                  </thead>
                  <tbody>
                    <ValidatorsList
                      validators={context.validators}
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
        <style jsx global>{`
          .nodes-card {
            margin-bottom: 24px;
          }
        `}</style>
      </>
    );
  }
}

export default Validators;
