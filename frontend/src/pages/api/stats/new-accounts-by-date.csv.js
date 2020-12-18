import { ExplorerApi } from "../../../libraries/explorer-wamp";

function formatDate(date) {
  const year = date.getFullYear();
  const month = "0" + (date.getMonth() + 1);
  const day = "0" + date.getDate();
  return `${year}-${month.slice(-2)}-${day.slice(-2)} 23:59:59`;
}

export default async function (req, res) {
  try {
    const newAccountsByDate = await new ExplorerApi(req).call(
      "select:INDEXER_BACKEND",
      [
        `SELECT
            TIMESTAMP 'epoch' + DIV(DIV(blocks.block_timestamp, 1000000000), 60 * 60 * 24) * INTERVAL '1 day' AS "date",
            COUNT(*) as new_accounts_by_date
          FROM accounts
          JOIN receipts ON receipts.receipt_id = accounts.created_by_receipt_id
          JOIN blocks ON blocks.block_hash = receipts.included_in_block_hash
          GROUP BY "date"
          ORDER BY "date"`,
      ]
    );
    res.send(
      "Date,Number of new accounts by date\n" +
        newAccountsByDate
          .map(({ date: dateString, new_accounts_by_date }) => {
            const date = new Date(dateString);
            return `${formatDate(date)},${new_accounts_by_date}`;
          })
          .join("\n")
    );
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
    return;
  }
}
