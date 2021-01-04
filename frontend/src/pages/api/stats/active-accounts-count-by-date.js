import StatsApi from "../../../libraries/explorer-wamp/stats";

export default async function (req, res) {
  try {
    const activeAccountsCountAggregatedByDate = await new StatsApi(
      req
    ).activeAccountsCountAggregatedByDate();
    if (activeAccountsCountAggregatedByDate) {
      res.send(activeAccountsCountAggregatedByDate);
    } else {
      res.send([]);
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
    return;
  }
}
