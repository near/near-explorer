import * as React from "react";

import { Table, OnPageChange } from "../utils/Table";
import PaginationSpinner from "../utils/PaginationSpinner";

import ValidatorsList, { ITEMS_PER_PAGE } from "./ValidatorsList";

import { useTranslation } from "react-i18next";
import { useNetworkStats, useValidators } from "../../hooks/subscriptions";
import { styled } from "../../libraries/styles";
import { PaginateWrapper } from "../utils/Pagination";

const ValidatorNodePagination = styled(PaginateWrapper, {
  backgroundColor: "#ffffff",
});

const Validators: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const [selectedPageIndex, setSelectedPageIndex] = React.useState(0);

  const onPageChange = React.useCallback<NonNullable<OnPageChange>>(
    ({ selected }) => {
      setSelectedPageIndex(selected);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    [setSelectedPageIndex]
  );

  const validatorsQuery = useValidators();
  const validators = validatorsQuery.data?.validators;
  const { data: networkStats } = useNetworkStats();
  const totalStake = networkStats?.totalStake;

  if (!validators || !totalStake) {
    return <PaginationSpinner />;
  }

  return (
    <Table
      pagination={
        validators.length > ITEMS_PER_PAGE
          ? {
              overrideComponent: ValidatorNodePagination,
              pageCount: Math.ceil(validators.length / ITEMS_PER_PAGE),
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
          validators={validators}
          totalStake={totalStake}
          selectedPageIndex={selectedPageIndex}
        />
      </tbody>
    </Table>
  );
});

export default Validators;
