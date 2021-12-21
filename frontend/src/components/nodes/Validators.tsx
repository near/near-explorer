import { FC, useState, useCallback } from "react";

import { NodeConsumer } from "../../context/NodeProvider";

import { Table, OnPageChange } from "../utils/Table";
import PaginationSpinner from "../utils/PaginationSpinner";

import ValidatorsList from "./ValidatorsList";

import { Translate } from "react-localize-redux";

const ITEMS_PER_PAGE = 120;

const Validators: FC = () => {
  const [activePage, setActivePage] = useState(0);
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(ITEMS_PER_PAGE);

  const onPageChange = useCallback<NonNullable<OnPageChange>>(
    ({ selected }) => {
      setActivePage(selected);
      setStartPage(selected * ITEMS_PER_PAGE + 1);
      setEndPage(selected * ITEMS_PER_PAGE + ITEMS_PER_PAGE);
    },
    []
  );

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
                      context.stakingNodes.length > ITEMS_PER_PAGE
                        ? {
                            className: "validators-node-pagination",
                            pageCount: Math.ceil(
                              context.stakingNodes.length / ITEMS_PER_PAGE
                            ),
                            marginPagesDisplayed: 1,
                            pageRangeDisplayed: 3,
                            onPageChange,
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
                          itemsPerPage: ITEMS_PER_PAGE,
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
};

export default Validators;
