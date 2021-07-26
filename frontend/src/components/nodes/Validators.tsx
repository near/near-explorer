import React from "react";

import { NodeConsumer } from "../../context/NodeProvider";

import { onPageChange as P } from "../utils/Pagination";
import { Table } from "../utils/Table";
import PaginationSpinner from "../utils/PaginationSpinner";

import ValidatorsList from "./ValidatorsList";

import { Translate } from "react-localize-redux";

interface Props {
  nearNetwork: string;
  itemsPerPage: number;
}

class Validators extends React.PureComponent<Props> {
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
                  {context.totalValidatorsPool ? (
                    <Table
                      className="validators-section"
                      pagination={
                        context.totalValidatorsPool.length > itemsPerPage
                          ? {
                              className: "validators-node-pagination",
                              pageCount: Math.ceil(
                                context.totalValidatorsPool.length / itemsPerPage
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
                          <th>Location</th>
                          <th>
                            {translate(
                              "component.nodes.Validators.validator"
                            )}
                          </th>
                          <th>
                            {translate("component.nodes.Validators.fee")}
                          </th>
                          <th>
                            {translate(
                              "component.nodes.Validators.delegators"
                            )}
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
                          validators={context.totalValidatorsPool}
                          pages={{
                            startPage,
                            endPage,
                            activePage,
                            itemsPerPage,
                          }}
                          cellCount={8}
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
