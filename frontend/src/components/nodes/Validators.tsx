import React from "react";

import { NodeConsumer } from "../../context/NodeProvider";

import { onPageChange as P } from "../utils/Pagination";
import { Table } from "../utils/Table";
import PaginationSpinner from "../utils/PaginationSpinner";

import ValidatorsList from "./ValidatorsList";

interface Props {
  type: string;
  itemsPerPage: number;
}

class Validators extends React.PureComponent<Props> {
  static defaultProps = {
    itemsPerPage: 12,
  };

  state = {
    activePage: 0,
    startPage: 1,
    endPage: this.props.itemsPerPage,
  };
  onPageChange = ({ selected }: P) => {
    const { itemsPerPage } = this.props;
    this.setState({
      activePage: selected,
      startPage: selected * itemsPerPage + 1,
      endPage: selected * itemsPerPage + itemsPerPage,
    });
  };

  render() {
    const { activePage, startPage, endPage } = this.state;
    const { type, itemsPerPage } = this.props;

    const tableColumns =
      type === "validators"
        ? [
            " ",
            "#",
            "Validator",
            "Fee",
            "Delegators",
            "Stake",
            "Cumulative Stake",
          ]
        : [" ", "#", "Validator", "Fee", "Delegators", "Stake"];

    return (
      <>
        <NodeConsumer>
          {(context) => {
            const validatorType =
              type === "validators" ? context.validators : context.proposals;
            return (
              <>
                {validatorType ? (
                  <Table
                    className="validators-section"
                    pagination={{
                      className: "validators-node-pagination",
                      pageCount: Math.ceil(validatorType.length / itemsPerPage),
                      marginPagesDisplayed: 1,
                      pageRangeDisplayed: 3,
                      onPageChange: this.onPageChange,
                    }}
                  >
                    <thead>
                      <tr className="validators-header-row">
                        {tableColumns.map((title: string, index) => (
                          <th
                            key={`${[type]}_heder_cell_${index}`}
                            className={
                              title.toLowerCase() === "stake"
                                ? "text-right"
                                : ""
                            }
                          >
                            {title}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <ValidatorsList
                        validators={validatorType}
                        pages={{
                          startPage,
                          endPage,
                          activePage,
                          itemsPerPage,
                        }}
                        cellCount={tableColumns.length}
                        validatorType={type}
                      />
                    </tbody>
                  </Table>
                ) : (
                  <PaginationSpinner hidden={false} />
                )}
              </>
            );
          }}
        </NodeConsumer>
        <style jsx global>{`
          .validators-node-pagination {
            background-color: #ffffff;
          }
        `}</style>
      </>
    );
  }
}

export default Validators;
