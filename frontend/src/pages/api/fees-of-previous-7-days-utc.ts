import { format } from "date-fns";
import { NextApiHandler } from "next";

import {
  isNetworkOffline,
  respondNetworkOffline,
} from "@/frontend/libraries/api";
import { getNearNetworkName } from "@/frontend/libraries/config";
import { getTrpcClient } from "@/frontend/libraries/trpc";

const handler: NextApiHandler = async (req, res) => {
  try {
    const networkName = getNearNetworkName(req.query, req.headers.host);
    if (isNetworkOffline(networkName)) {
      return respondNetworkOffline(res, networkName);
    }
    const resp = [];
    for (let i = 1; i <= 7; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const tokensBurntPerDay = await getTrpcClient(
        networkName
      ).stats.tokensBurnt.query({ daysFromNow: i });
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
    // eslint-disable-next-line no-console
    console.error(`Handler ${req.url} failed:`, error);
    res.status(502).send(error);
  }
};

export default handler;
