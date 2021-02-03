import React, { useContext } from "react";
import ReactEcharts from "echarts-for-react";
import echarts from "echarts";
import { DatabaseContext } from "../../context/DatabaseProvider";
import moment from "moment";

export default () => {
  const value = useContext(DatabaseContext);
  const transactionCountArray = value.transactionCountArray;
  const nameMonth = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const date = transactionCountArray.map((t) => {
    let time = moment(t.date, "YYYY/MM/DD");
    let month = Number(time.format("M"));
    let day = time.format("D");
    return nameMonth[month - 1] + " " + day;
  });
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
        left: "5%",
        bottom: "3%",
        containLabel: true,
        backgroundColor: "#F9F9F9",
        show: true,
        color: "white",
        borderWidth: 0,
      },
      xAxis: [
        {
          type: "category",
          boundaryGap: false,
          data: date,
          axisLine: {
            show: false,
          },
          axisLabel: {
            color: "#9B9B9B",
          },
          offset: 3,
          axisTick: {
            show: false,
          },
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
          min: "6000",
          axisLabel: {
            color: "#9B9B9B",
          },
          offset: 3,
          axisTick: {
            show: false,
          },
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
                color: "rgba(0, 193, 222, 0.19)",
              },
              {
                offset: 1,
                color: "rgba(197, 247, 255, 0)",
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
        height: "232px",
        marginTop: "26px",
        marginBottom: "26px",
      }}
    />
  );
};
