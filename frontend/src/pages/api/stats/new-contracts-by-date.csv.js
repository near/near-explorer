import StatsApi from "../../../libraries/explorer-wamp/stats";

export default async function (req, res) {
  try {
    const newContractsByDate = await new StatsApi(req).newContractsByDate();
    res.send(
      "Date,Number of new contracts by date\n" +
        newContractsByDate
          .map(({ date, contracts }) => `${date},${contracts}`)
          .join("\n")
    );
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
    return;
  }
}
