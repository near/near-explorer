import React, { useState, useEffect } from "react";
import ReactEcharts from "echarts-for-react";
import * as echarts from "echarts";
import { Tabs, Tab } from "react-bootstrap";

import { AccountsByDate } from "../../libraries/explorer-wamp/stats";

import { Props } from "./TransactionsByDate";

import { Translate } from "react-localize-redux";

const ActiveAccountsByDate = ({ chartStyle }: Props) => {
  //const [activeAccountsByDate, setAccounts] = useState(Array());
  //const [date, setDate] = useState(Array());
  const [activeAccountsByWeek, setWeekAccounts] = useState(Array());
  const [week, setWeek] = useState(Array());

  useEffect(() => {
    // TODO: Put a proper implementation in near-analytics.
    // XXX: Hardcoded values from this query:
    //
    /*let accounts = [];
    if (accounts) {
      const newAccounts = accounts.map((account: AccountsByDate) =>
        Number(account.accountsCount)
      );
      const date = accounts.map((account: AccountsByDate) =>
        account.date.slice(0, 10)
      );
      setAccounts(newAccounts);
      setDate(date);
    }*/

    // TODO: Put a proper implementation in near-analytics.
    // XXX: Hardcoded values from this query:
    // select to_timestamp(receipt_included_in_block_timestamp / 1000000000)::date as date
    //  ,count(*) as accountscount
    //  from action_receipt_actions
    // where receipt_receiver_account_id = 'v1.nearapps.near'
    //   and to_timestamp(receipt_included_in_block_timestamp / 1000000000) > NOW() - interval '60 days'
    // group by to_timestamp(receipt_included_in_block_timestamp / 1000000000)::Date;
    let accounts = [
      {
        date: "2022-01-02 23:59:59",
        accountsCount: 214,
      },
      {
        date: "2021-01-12 23:59:59",
        accountsCount: 277,
      },
      {
        date: "2021-12-19 23:59:59",
        accountsCount: 7902,
      },
      {
        date: "2021-12-26 23:59:59",
        accountsCount: 220,
      },
      {
        date: "2022-01-02 23:59:59",
        accountsCount: 214,
      },
      {
        date: "2022-01-09 23:59:59",
        accountsCount: 204774,
      },
      {
        date: "2022-01-16 23:59:59",
        accountsCount: 393725,
      },
      {
        date: "2022-01-23 23:59:59",
        accountsCount: 30946,
      },
    ];
    if (accounts) {
      const newAccounts = accounts.map((account: AccountsByDate) =>
        Number(account.accountsCount)
      );
      const week = accounts.map((account: AccountsByDate) =>
        account.date.slice(0, 10)
      );
      setWeekAccounts(newAccounts);
      setWeek(week);
    }
  }, []);

  const getOption = (
    title: string,
    seriesName: string,
    data: Array<number>,
    date: Array<string>
  ) => {
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
          data: date,
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
          name: seriesName,
          type: "line",
          lineStyle: {
            color: "#04a7bf",
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
                color: "rgb(4, 167, 191)",
              },
              {
                offset: 1,
                color: "rgb(201, 248, 255)",
              },
            ]),
          },
          data: data,
        },
      ],
    };
  };

  return (
    <Translate>
      {({ translate }) => (
        <Tabs defaultActiveKey="weekly" id="activeAccountsByDate">
          {/*<Tab eventKey="daily" title={translate("common.stats.daily")}>
            <ReactEcharts
              option={getOption(
                "Daily Number of Active NearApps Users",
                "Active NearApps Users",
                activeAccountsByDate,
                date
              )}
              style={chartStyle}
            />
          </Tab>*/}
          <Tab eventKey="weekly" title={translate("common.stats.weekly")}>
            <ReactEcharts
              option={getOption(
                "Weekly Number of Active NearApps Users",
                "Active NearApps Users",
                activeAccountsByWeek,
                week
              )}
              style={chartStyle}
            />
          </Tab>
        </Tabs>
      )}
    </Translate>
  );
};

export default ActiveAccountsByDate;
