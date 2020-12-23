import StatsApi from "../../../libraries/explorer-wamp/stats";

export default async function (req, res) {
  try {
    const teragasUsedAggregatedByDate = await new StatsApi(
      req
    ).teragasUsedAggregatedByDate();
    res.send(
      "Date,TGas used by date\n" +
        teragasUsedAggregatedByDate
          .map(({ date, teragasUsed }) => `${date},${teragasUsed}`)
          .join("\n")
    );
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
    return;
  }
}
