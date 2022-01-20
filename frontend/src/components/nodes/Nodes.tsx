import { FC, useCallback, useState } from "react";

import * as N from "../../libraries/explorer-wamp/nodes";
import { NodeConsumer } from "../../context/NodeProvider";

import { Table, OnPageChange } from "../utils/Table";

import NodeRow from "./NodeRow";
import PaginationSpinner from "../utils/PaginationSpinner";

import { useTranslation } from "react-i18next";

const ITEMS_PER_PAGE = 10;

const Nodes: FC = () => {
  const { t } = useTranslation();
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
    <NodeConsumer>
      {(context) => (
        <>
          {context.onlineNodes ? (
            <Table
              className="online-nodes-section"
              pagination={{
                className: "online-nodes-pagination",
                pageCount: Math.ceil(
                  context.onlineNodes.length / ITEMS_PER_PAGE
                ),
                marginPagesDisplayed: 1,
                pageRangeDisplayed: 3,
                onPageChange,
              }}
            >
              <thead>
                <tr className="online-nodes-header-row">
                  <th />
                  <th>#</th>
                  <th>{t("component.nodes.Nodes.validator")}</th>
                </tr>
              </thead>
              <tbody>
                {context.onlineNodes
                  .slice(startPage - 1, endPage)
                  .map((node: N.NodeInfo, index: number) => (
                    <NodeRow
                      key={node.nodeId}
                      node={node}
                      index={activePage * ITEMS_PER_PAGE + index + 1}
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
  );
};

export default Nodes;
