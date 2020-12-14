import React from "react";
import ReactEcharts from "echarts-for-react";
import echarts from "echarts";

export default class extends React.Component {
  render() {
    const option = {
      xAxis: {
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: "line",
        },
      ],
    };
    return <ReactEcharts option={option} />;
  }
}
