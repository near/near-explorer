import React, { useContext } from "react";
import ReactEcharts from "echarts-for-react";
import echarts from "echarts";
import { DatabaseContext } from "../../context/DatabaseProvider";
import moment from "moment";

export default () => {
  const value = useContext(DatabaseContext);
  const transactionCountArray = value.transactionCountArray;
  const date = transactionCountArray.map((t) => moment(t.date).format("LL"));
  const count = transactionCountArray.map((t) => t.total);
  const getOption = () => {
    return {
      title: {
        text: "14 Day History ",
      },
      tooltip: {
        trigger: "axis",
        position: "top",
        backgroundColor: "#25272A",
        formatter: "{b0}<br />Txns: {c0}",
      },
      grid: {
        left: "3%",
        right: "10",
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
          data: date,
          axisLine: {
            show: false,
          },
          offset: 3,
        },
      ],
      yAxis: [
        {
          type: "value",
          splitLine: {
            lineStyle: {
              color: "white",
            },
          },
          splitNumber: 3,
          axisLine: {
            show: false,
          },
          min: "dataMin",
        },
      ],
      series: [
        {
          name: "Txns",
          type: "line",
          smooth: true,
          lineStyle: {
            color: "#00C1DE",
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
                color: "rgb(0, 193, 222)",
              },
              {
                offset: 1,
                color: "rgb(197, 247, 255)",
              },
            ]),
          },
          data: count,
        },
      ],
    };
  };
  return (
    <ReactEcharts
      option={getOption()}
      style={{
        height: "176px",
        width: "100%",
        marginTop: "26px",
        marginLeft: "24px",
      }}
    />
  );
};
