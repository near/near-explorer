import StatsApi from "../../../libraries/explorer-wamp/stats";

export default async function (req, res) {
  try {
    const activeContractsCountAggregatedByDate = await new StatsApi(
      req
    ).activeContractsCountAggregatedByDate();
    if (activeContractsCountAggregatedByDate) {
      res.send(activeContractsCountAggregatedByDate);
    } else {
      res.send([]);
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
    return;
  }
}
