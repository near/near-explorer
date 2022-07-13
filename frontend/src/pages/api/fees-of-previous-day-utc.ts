import moment from "moment";
import { NextApiHandler } from "next";
import { getNearNetworkName } from "../../libraries/config";
import { getTrpcClient } from "../../libraries/trpc";

const handler: NextApiHandler = async (req, res) => {
  try {
    const networkName = getNearNetworkName(req.query, req.headers.host);
    const feeCountPerDay = await getTrpcClient(networkName).query(
      "stats.tokensBurnt",
      { daysFromNow: 1 }
    );
    if (!feeCountPerDay) {
      res.status(500).end();
      return;
    }
    const resp = {
      date: moment(feeCountPerDay.timestamp).format("YYYY-MM-DD"),
      collected_fee_in_yoctonear: feeCountPerDay.tokensBurnt,
    };
    res.send(resp);
  } catch (error) {
    console.error(`Handler ${req.url} failed:`, error);
    res.status(502).send(error);
  }
};

export default handler;
