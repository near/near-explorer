import StatsApi from "../../../libraries/explorer-wamp/stats";

export default async function (req, res) {
  try {
    const depositAggregatedByDate = await new StatsApi(
      req
    ).depositAggregatedByDate();
    if (depositAggregatedByDate) {
      res.send(depositAggregatedByDate);
    } else {
      res.status(425).end();
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
    return;
  }
}
