import { FC, useState, useCallback } from "react";

import { Table, OnPageChange } from "../utils/Table";
import PaginationSpinner from "../utils/PaginationSpinner";

import ValidatorsList from "./ValidatorsList";

import { useTranslation } from "react-i18next";
import { useNodes } from "../../hooks/subscriptions";
import { styled } from "../../libraries/styles";
import { PaginateWrapper } from "../utils/Pagination";

const ValidatorNodePagination = styled(PaginateWrapper, {
  backgroundColor: "#ffffff",
});

const ITEMS_PER_PAGE = 120;

const Validators: FC = () => {
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

  const stakingNodes = useNodes()?.stakingNodes;

  if (!stakingNodes) {
    return <PaginationSpinner />;
  }

  return (
    <Table
      pagination={
        stakingNodes.length > ITEMS_PER_PAGE
          ? {
              overrideComponent: ValidatorNodePagination,
              pageCount: Math.ceil(stakingNodes.length / ITEMS_PER_PAGE),
              marginPagesDisplayed: 1,
              pageRangeDisplayed: 3,
              onPageChange,
            }
          : undefined
      }
    >
      <thead>
        <tr>
          <th />
          <th>#</th>
          <th>{t("component.nodes.Validators.location")}</th>
          <th>{t("component.nodes.Validators.validator")}</th>
          <th>{t("component.nodes.Validators.fee")}</th>
          <th>{t("component.nodes.Validators.delegators")}</th>
          <th className="text-right">
            {t("component.nodes.Validators.stake")}
          </th>
          <th>{t("component.nodes.Validators.cumulative_stake")}</th>
        </tr>
      </thead>
      <tbody>
        <ValidatorsList
          validators={stakingNodes}
          pages={{
            startPage,
            endPage,
            activePage,
            itemsPerPage: ITEMS_PER_PAGE,
          }}
        />
      </tbody>
    </Table>
  );
};

export default Validators;
