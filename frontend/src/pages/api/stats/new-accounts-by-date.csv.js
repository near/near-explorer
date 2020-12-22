import StatsApi from "../../../libraries/explorer-wamp/stats";

export default async function (req, res) {
  try {
    const newAccountsByDate = await new StatsApi(req).newAccountsByDate();
    res.send(
      "Date,Number of new accounts by date\n" +
        newAccountsByDate
          .map(({ date, accounts }) => `${date},${accounts}`)
          .join("\n")
    );
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
    return;
  }
}
