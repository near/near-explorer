import { format } from "date-fns";
import { NextApiHandler } from "next";

import {
  isNetworkOffline,
  respondNetworkOffline,
} from "@explorer/frontend/libraries/api";
import { getNearNetworkName } from "@explorer/frontend/libraries/config";
import { getTrpcClient } from "@explorer/frontend/libraries/trpc";

const handler: NextApiHandler = async (req, res) => {
  try {
    const networkName = getNearNetworkName(req.query, req.headers.host);
    if (isNetworkOffline(networkName)) {
      return respondNetworkOffline(res, networkName);
    }
    const resp = [];
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
        date: format(tokensBurntPerDay.timestamp, "yyyy-MM-dd"),
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
