import moment from "moment";
import { NextApiHandler } from "next";
import { getNearNetworkName } from "../../libraries/config";
import { getTrpcClient } from "../../libraries/trpc";

const handler: NextApiHandler = async (req, res) => {
  try {
    const networkName = getNearNetworkName(req.query, req.headers.host);
    let resp = [];
    for (let i = 1; i <= 7; i++) {
      const tokensBurntPerDay = await getTrpcClient(networkName).query(
        "stats.tokensBurnt",
        { daysFromNow: i }
      );
      if (!tokensBurntPerDay) {
        res.status(500).end();
        return;
      }
      resp.push({
        date: moment(tokensBurntPerDay.timestamp).format("YYYY-MM-DD"),
        collected_fee_in_yoctonear: tokensBurntPerDay.tokensBurnt,
      });
    }
    res.send(resp);
  } catch (error) {
    console.error(`Handler ${req.url} failed:`, error);
    res.status(502).send(error);
  }
};

export default handler;
