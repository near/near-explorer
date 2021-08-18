import React from "react";

import { NodeConsumer } from "../../context/NodeProvider";

import { onPageChange as P } from "../utils/Pagination";
import { Table } from "../utils/Table";
import PaginationSpinner from "../utils/PaginationSpinner";

import ValidatorsList from "./ValidatorsList";

import { Translate } from "react-localize-redux";

interface Props {
  itemsPerPage: number;
}

class Validators extends React.Component<Props> {
  static defaultProps = {
    itemsPerPage: 120,
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
    const { itemsPerPage } = this.props;

    return (
      <Translate>
        {({ translate }) => (
          <>
            <NodeConsumer>
              {(context) => (
                <>
                  {context.stakingNodes ? (
                    <Table
                      className="validators-section"
                      pagination={
                        context.stakingNodes.length > itemsPerPage
                          ? {
                              className: "validators-node-pagination",
                              pageCount: Math.ceil(
                                context.stakingNodes.length / itemsPerPage
                              ),
                              marginPagesDisplayed: 1,
                              pageRangeDisplayed: 3,
                              onPageChange: this.onPageChange,
                            }
                          : undefined
                      }
                    >
                      <thead>
                        <tr className="validators-header-row">
                          <th />
                          <th>#</th>
                          <th>
                            {translate("component.nodes.Validators.location")}
                          </th>
                          <th>
                            {translate("component.nodes.Validators.validator")}
                          </th>
                          <th>{translate("component.nodes.Validators.fee")}</th>
                          <th>
                            {translate("component.nodes.Validators.delegators")}
                          </th>
                          <th className="text-right">
                            {translate("component.nodes.Validators.stake")}
                          </th>
                          <th>
                            {translate(
                              "component.nodes.Validators.cumulative_stake"
                            )}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <ValidatorsList
                          validators={context.stakingNodes}
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
                  <style jsx global>{`
                    .validators-node-pagination {
                      background-color: #ffffff;
                    }
                  `}</style>
                </>
              )}
            </NodeConsumer>
          </>
        )}
      </Translate>
    );
  }
}

export default Validators;
