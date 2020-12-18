import { ExplorerApi } from "../../../libraries/explorer-wamp";

function formatDate(date) {
  const year = date.getFullYear();
  const month = "0" + (date.getMonth() + 1);
  const day = "0" + date.getDate();
  return `${year}-${month.slice(-2)}-${day.slice(-2)} 23:59:59`;
}

export default async function (req, res) {
  try {
    const newContractsByDate = await new ExplorerApi(req).call(
      "select:INDEXER_BACKEND",
      [
        `SELECT
            TIMESTAMP 'epoch' + DIV(DIV(receipts.included_in_block_timestamp, 1000000000), 60 * 60 * 24) * INTERVAL '1 day' AS "date",
            COUNT(distinct receipts.receiver_account_id) AS new_contracts_by_date
          FROM action_receipt_actions
          JOIN receipts ON receipts.receipt_id = action_receipt_actions.receipt_id 
          WHERE action_receipt_actions.action_kind = 'DEPLOY_CONTRACT'
          GROUP BY "date"
          ORDER BY "date"`,
      ]
    );
    res.send(
      "Date,Number of new contracts by date\n" +
        newContractsByDate
          .map(({ date: dateString, new_contracts_by_date }) => {
            const date = new Date(dateString);
            return `${formatDate(date)},${new_contracts_by_date}`;
          })
          .join("\n")
    );
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
    return;
  }
}
