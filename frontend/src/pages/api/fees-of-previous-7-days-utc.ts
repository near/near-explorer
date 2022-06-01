import moment from "moment";
import { NextApiHandler } from "next";
import { getNearNetworkName } from "../../libraries/config";
import { getTrpcClient } from "../../libraries/trpc";

const handler: NextApiHandler = async (req, res) => {
  try {
    const networkName = getNearNetworkName(req.query, req.headers.host);
    let resp = [];
    for (let i = 1; i <= 7; i++) {
      const feeCountPerDay = await getTrpcClient(
        networkName
      ).query("nearcore-total-fee-count", [i]);
      if (!feeCountPerDay) {
        res.status(500).end();
        return;
      }
      resp.push({
        date: moment(feeCountPerDay?.date).format("YYYY-MM-DD"),
        collected_fee_in_yoctonear: feeCountPerDay?.fee,
      });
    }
    res.send(resp);
  } catch (error) {
    console.error(`Handler ${req.url} failed:`, error);
    res.status(502).send(error);
  }
};

export default handler;
