import * as React from "react";

import * as echarts from "echarts";
import ReactEcharts from "echarts-for-react";
import JSBI from "jsbi";
import { Tabs, Tab } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import { TRPCSubscriptionOutput } from "@explorer/common/types/trpc";
import { Props } from "@explorer/frontend/components/stats/TransactionsByDate";
import PaginationSpinner from "@explorer/frontend/components/utils/PaginationSpinner";
import { useSubscription } from "@explorer/frontend/hooks/use-subscription";
import * as BI from "@explorer/frontend/libraries/bigint";
import { getCumulativeArray } from "@explorer/frontend/libraries/stats";

const getOption = (
  title: string,
  yAxisTitle: string,
  data: TRPCSubscriptionOutput<"gasUsedHistory">
) => ({
  title: {
    text: title,
  },
  tooltip: {
    trigger: "axis",
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
    backgroundColor: "#F9F9F9",
    show: true,
    color: "white",
  },
  xAxis: [
    {
      type: "time",
      boundaryGap: false,
    },
  ],
  yAxis: [
    {
      type: "value",
      name: yAxisTitle,
      splitLine: {
        lineStyle: {
          color: "white",
        },
      },
    },
  ],
  dataZoom: [
    {
      type: "inside",
      start: 0,
      end: 100,
      filterMode: "filter",
    },
    {
      start: 0,
      end: 100,
    },
  ],
  series: [
    {
      name: yAxisTitle,
      type: "line",
      lineStyle: {
        color: "#4d84d6",
        width: 2,
      },
      symbol: "none",
      itemStyle: {
        color: "#25272A",
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: "rgb(21, 99, 214)",
          },
          {
            offset: 1,
            color: "rgb(197, 221, 255)",
          },
        ]),
      },
      data,
    },
  ],
});

const getGasCostInNear = (
  gasPrice: string,
  teraGasUsed: number,
  precision = 3
) => {
  const precisionMultiplier = 10 ** precision;
  const gasPriceWithPrecision = JSBI.multiply(
    JSBI.BigInt(gasPrice),
    JSBI.BigInt(precisionMultiplier)
  );
  const gasInYoctoNearWithPrecision = JSBI.multiply(
    JSBI.BigInt(teraGasUsed),
    gasPriceWithPrecision
  );
  const gasInNearWithPrecision = JSBI.divide(
    gasInYoctoNearWithPrecision,
    JSBI.exponentiate(
      BI.ten,
      JSBI.BigInt(BI.nearNominationExponent - BI.teraGasNominationExponent)
    )
  );
  return JSBI.toNumber(gasInNearWithPrecision) / precisionMultiplier;
};

const GasUsedByDateChart: React.FC<Props> = React.memo(({ chartStyle }) => {
  const { t, i18n } = useTranslation();
  const latestGasPriceSub = useSubscription(["latestGasPrice"]);
  const gasUsedHistorySub = useSubscription(["gasUsedHistory"]);

  const options = React.useMemo(() => {
    if (!gasUsedHistorySub.data) {
      return;
    }
    return {
      daily: getOption(
        t("component.stats.GasUsedByDate.daily_amount_of_used_gas"),
        t("component.stats.GasUsedByDate.petagas"),
        gasUsedHistorySub.data.map(([timestamp, teraGasUsed]) => [
          timestamp,
          teraGasUsed / 1000,
        ])
      ),
      cumulative: getOption(
        t("component.stats.GasUsedByDate.total_amount_of_used_gas"),
        t("component.stats.GasUsedByDate.petagas"),
        getCumulativeArray(
          gasUsedHistorySub.data,
          ([teraGasUsed]) => teraGasUsed / 1000
        )
      ),
    };
  }, [gasUsedHistorySub.data, i18n.language]);

  const feeOption = React.useMemo(() => {
    if (!gasUsedHistorySub.data || !latestGasPriceSub.data) {
      return;
    }
    return getOption(
      t("component.stats.GasUsedByDate.daily_gas_fee_in_near"),
      "NEAR",
      gasUsedHistorySub.data.map(([timestamp, teraGasUsed]) => [
        timestamp,
        getGasCostInNear(latestGasPriceSub.data, teraGasUsed),
      ])
    );
  }, [gasUsedHistorySub.data, latestGasPriceSub.data, i18n.language]);

  return (
    <Tabs defaultActiveKey="daily" id="gasUsedByDate">
      <Tab eventKey="daily" title={t("common.stats.daily")}>
        {options ? (
          <ReactEcharts option={options.daily} style={chartStyle} />
        ) : (
          <PaginationSpinner />
        )}
      </Tab>
      <Tab eventKey="total" title={t("common.stats.total")}>
        {options ? (
          <ReactEcharts option={options.cumulative} style={chartStyle} />
        ) : (
          <PaginationSpinner />
        )}
      </Tab>
      <Tab eventKey="fee" title={t("component.stats.GasUsedByDate.gas_fee")}>
        {feeOption ? (
          <ReactEcharts option={feeOption} style={chartStyle} />
        ) : (
          <PaginationSpinner />
        )}
      </Tab>
    </Tabs>
  );
});

export default GasUsedByDateChart;
