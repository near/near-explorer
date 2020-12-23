import StatsApi from "../../../libraries/explorer-wamp/stats";

export default async function (req, res) {
  try {
    const activeAccountsCountAggregatedByDate = await new StatsApi(
      req
    ).activeAccountsCountAggregatedByDate();
    res.send(
      "Date,Number of active accounts by date\n" +
        activeAccountsCountAggregatedByDate
          .map(({ date, accountsCount }) => `${date},${accountsCount}`)
          .join("\n")
    );
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
    return;
  }
}
