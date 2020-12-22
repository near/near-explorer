import StatsApi from "../../../libraries/explorer-wamp/stats";

export default async function (req, res) {
  try {
    const teragasUsedByDate = await new StatsApi(req).teragasUsedByDate();
    res.send(
      "Date,TGas used by date\n" +
        teragasUsedByDate
          .map(({ date, teragas }) => `${date},${teragas}`)
          .join("\n")
    );
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
    return;
  }
}
