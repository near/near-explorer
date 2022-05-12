import * as React from "react";
import { Tabs, Tab } from "react-bootstrap";
import ReactEcharts from "echarts-for-react";
import * as echarts from "echarts";
import JSBI from "jsbi";

import { Props } from "./TransactionsByDate";

import { useTranslation } from "react-i18next";
import { useLatestGasPrice } from "../../hooks/data";
import { useQueryOrDefault } from "../../hooks/use-query";
import { cumulativeSumArray } from "../../libraries/stats";
import * as BI from "../../libraries/bigint";

const gasNomination = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(15));

const GasUsedByDateChart: React.FC<Props> = React.memo(({ chartStyle }) => {
  const { t } = useTranslation();
  const latestGasPrice = useLatestGasPrice();
  const gasUsedByDate =
    useQueryOrDefault("gas-used-aggregated-by-date", [], []) ?? [];
  const gasUsed = React.useMemo(
    () =>
      gasUsedByDate.map(({ gasUsed }) =>
        JSBI.toNumber(JSBI.divide(JSBI.BigInt(gasUsed), gasNomination))
      ),
    [gasUsedByDate]
  );
  const gasUsedCumulative = React.useMemo(() => cumulativeSumArray(gasUsed), [
    gasUsed,
  ]);
  const gasUsedDates = React.useMemo(
    () => gasUsedByDate.map(({ date }) => date.slice(0, 10)),
    [gasUsedByDate]
  );
  const feeUsedByDate = React.useMemo(() => {
    if (!latestGasPrice) {
      return [];
    }
    return gasUsedByDate.map(
      ({ gasUsed }) =>
        JSBI.toNumber(
          JSBI.divide(
            JSBI.multiply(
              JSBI.BigInt(gasUsed),
              JSBI.multiply(JSBI.BigInt(latestGasPrice), JSBI.BigInt(1000))
            ),
            BI.nearNomination
          )
        ) / 1000
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
});

export default GasUsedByDateChart;
