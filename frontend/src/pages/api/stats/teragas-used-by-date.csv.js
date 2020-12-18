import { ExplorerApi } from "../../../libraries/explorer-wamp";

function formatDate(date) {
  const year = date.getFullYear();
  const month = "0" + (date.getMonth() + 1);
  const day = "0" + date.getDate();
  return `${year}-${month.slice(-2)}-${day.slice(-2)} 23:59:59`;
}

export default async function (req, res) {
  try {
    const teragasUsedByDate = await new ExplorerApi(req).call(
      "select:INDEXER_BACKEND",
      [
        `SELECT
            TIMESTAMP 'epoch' + DIV(DIV(blocks.block_timestamp, 1000000000), 60 * 60 * 24) * INTERVAL '1 day' AS "date",
            DIV(SUM(chunks.gas_used), 1000000000000) AS teragas_used_by_date
          FROM blocks
          JOIN chunks ON chunks.included_in_block_hash = blocks.block_hash
          GROUP BY "date"
          ORDER BY "date"`,
      ]
    );
    res.send(
      "Date,TGas used by date\n" +
        teragasUsedByDate
          .map(({ date: dateString, teragas_used_by_date }) => {
            const date = new Date(dateString);
            return `${formatDate(date)},${teragas_used_by_date}`;
          })
          .join("\n")
    );
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
    return;
  }
}
