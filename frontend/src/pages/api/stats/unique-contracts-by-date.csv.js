import StatsApi from "../../../libraries/explorer-wamp/stats";

export default async function (req, res) {
  try {
    const uniqueContractsCountAggregatedByDate = await new StatsApi(
      req
    ).uniqueContractsCountAggregatedByDate();
    res.send(
      "Date,Number of new contracts by date\n" +
        uniqueContractsCountAggregatedByDate
          .map(({ date, contractsCount }) => `${date},${contractsCount}`)
          .join("\n")
    );
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
    return;
  }
}
