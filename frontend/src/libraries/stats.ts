export const getCumulativeArray = <Rest extends unknown[]>(
  data: [number, ...Rest][],
  getNumberFromRest: (elements: Rest) => number
) =>
  data.reduce<{
    cumulativeData: number;
    series: [number, number][];
  }>(
    ({ cumulativeData: prevCumulativeData, series }, [timestamp, ...els]) => {
      const cumulativeData = prevCumulativeData + getNumberFromRest(els);
      return {
        cumulativeData,
        series: [...series, [timestamp, cumulativeData]],
      };
    },
    {
      cumulativeData: 0,
      series: [],
    }
  ).series;
