import StatsApi from "../../../libraries/explorer-wamp/stats";

export default async function (req, res) {
  try {
    const totalDepositAmount = await new StatsApi(req).totalDepositAmount();
    if (totalDepositAmount) {
      res.send(totalDepositAmount);
    } else {
      res.send([]);
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
    return;
  }
}
