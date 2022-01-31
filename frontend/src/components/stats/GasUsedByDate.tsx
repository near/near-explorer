import React, { useMemo } from "react";
import { Tabs, Tab } from "react-bootstrap";
import ReactEcharts from "echarts-for-react";
import * as echarts from "echarts";
import BN from "bn.js";
import { utils } from "near-api-js";

import { Props } from "./TransactionsByDate";

import { useTranslation } from "react-i18next";
import { useLatestGasPrice } from "../../hooks/data";
import { useWampSimpleQuery } from "../../hooks/wamp";
import { cumulativeSumArray } from "../../libraries/stats";

const GasUsedByDateChart = ({ chartStyle }: Props) => {
  const { t } = useTranslation();
  const latestGasPrice = useLatestGasPrice();
  const gasUsedByDate =
    useWampSimpleQuery("gas-used-aggregated-by-date", []) ?? [];
  const gasUsed = useMemo(
    () =>
      gasUsedByDate.map(({ gasUsed }) =>
        new BN(gasUsed).divn(1000000).divn(1000000).divn(1000).toNumber()
      ),
    [gasUsedByDate]
  );
  const gasUsedCumulative = useMemo(() => cumulativeSumArray(gasUsed), [
    gasUsed,
  ]);
  const gasUsedDates = useMemo(
    () => gasUsedByDate.map(({ date }) => date.slice(0, 10)),
    [gasUsedByDate]
  );
  const feeUsedByDate = useMemo(() => {
    if (!latestGasPrice) {
      return [];
    }
    return gasUsedByDate.map(
      ({ gasUsed }) =>
        new BN(gasUsed)
          .mul(latestGasPrice)
          .muln(1000)
          .div(utils.format.NEAR_NOMINATION)
          .toNumber() / 1000
    );
  }, [latestGasPrice, gasUsedByDate]);

  const getOption = (title: string, data: Array<number>, name: string) => {
    return {
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
          type: "category",
          boundaryGap: false,
          data: gasUsedDates,
        },
      ],
      yAxis: [
        {
          type: "value",
          name: name,
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
          name: name,
          type: "line",
          lineStyle: {
            color: "#4d84d6",
            width: 2,
          },
          symbol: "circle",
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
          data: data,
        },
      ],
    };
  };

  return (
    <Tabs defaultActiveKey="daily" id="gasUsedByDate">
      <Tab eventKey="daily" title={t("common.stats.daily")}>
        <ReactEcharts
          option={getOption(
            t("component.stats.GasUsedByDate.daily_amount_of_used_gas"),
            gasUsed,
            t("component.stats.GasUsedByDate.petagas")
          )}
          style={chartStyle}
        />
      </Tab>
      <Tab eventKey="total" title={t("common.stats.total")}>
        <ReactEcharts
          option={getOption(
            t("component.stats.GasUsedByDate.total_amount_of_used_gas"),
            gasUsedCumulative,
            t("component.stats.GasUsedByDate.petagas")
          )}
          style={chartStyle}
        />
      </Tab>
      {feeUsedByDate.length > 0 && (
        <Tab eventKey="fee" title={t("component.stats.GasUsedByDate.gas_fee")}>
          <ReactEcharts
            option={getOption(
              t("component.stats.GasUsedByDate.daily_gas_fee_in_near"),
              feeUsedByDate,
              "NEAR"
            )}
            style={chartStyle}
          />
        </Tab>
      )}
    </Tabs>
  );
};

export default GasUsedByDateChart;
