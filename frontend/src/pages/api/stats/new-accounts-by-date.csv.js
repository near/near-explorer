import StatsApi from "../../../libraries/explorer-wamp/stats";

export default async function (req, res) {
  try {
    const newAccountsCountAggregatedByDate = await new StatsApi(
      req
    ).newAccountsCountAggregatedByDate();
    res.send(
      "Date,Number of new accounts by date\n" +
        newAccountsCountAggregatedByDate
          .map(({ date, accountsCount }) => `${date},${accountsCount}`)
          .join("\n")
    );
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
    return;
  }
}
