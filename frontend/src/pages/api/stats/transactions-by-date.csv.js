import StatsApi from "../../../libraries/explorer-wamp/stats";

export default async function (req, res) {
  try {
    const transactionsCountAggregatedByDate = await new StatsApi(
      req
    ).transactionsCountAggregatedByDate();
    res.send(
      "Date,Number of transactions by date\n" +
        transactionsCountAggregatedByDate
          .map(({ date, transactionsCount }) => `${date},${transactionsCount}`)
          .join("\n")
    );
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
    return;
  }
}
