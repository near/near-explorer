import StatsApi from "../../../libraries/explorer-wamp/stats";

export default async function (req, res) {
  try {
    const activeContractsCountAggregatedByDate = await new StatsApi(
      req
    ).activeContractsCountAggregatedByDate();
    res.send(
      "Date,Number of active contracts by date\n" +
        activeContractsCountAggregatedByDate
          .map(({ date, contractsCount }) => `${date},${contractsCount}`)
          .join("\n")
    );
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
    return;
  }
}
