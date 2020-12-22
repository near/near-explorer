import StatsApi from "../../../libraries/explorer-wamp/stats";

export default async function (req, res) {
  try {
    const transactionsByDate = await new StatsApi(req).transactionsByDate();
    res.send(
      "Date,Number of transactions by date\n" +
        transactionsByDate
          .map(({ date, transactions }) => `${date},${transactions}`)
          .join("\n")
    );
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
    return;
  }
}
