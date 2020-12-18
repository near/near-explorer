import { ExplorerApi } from "../../../libraries/explorer-wamp";

function formatDate(date) {
  const year = date.getFullYear();
  const month = "0" + (date.getMonth() + 1);
  const day = "0" + date.getDate();
  return `${year}-${month.slice(-2)}-${day.slice(-2)} 23:59:59`;
}

export default async function (req, res) {
  try {
    const transactionsByDate = await new ExplorerApi(req).call(
      "select:INDEXER_BACKEND",
      [
        `SELECT
            TIMESTAMP 'epoch' + DIV(DIV(blocks.block_timestamp, 1000000000), 60 * 60 * 24) * INTERVAL '1 day' AS "date",
            COUNT(*) AS transactions_by_date
          FROM transactions
          JOIN blocks ON blocks.block_hash = transactions.included_in_block_hash
          GROUP BY "date"
          ORDER BY "date"`,
      ]
    );
    res.send(
      "Date,Number of transactions by date\n" +
        transactionsByDate
          .map(({ date: dateString, transactions_by_date }) => {
            const date = new Date(dateString);
            return `${formatDate(date)},${transactions_by_date}`;
          })
          .join("\n")
    );
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
    return;
  }
}
