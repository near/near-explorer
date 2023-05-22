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
    const feeCountPerDay = await getTrpcClient(
      networkName
    ).stats.tokensBurnt.query({ daysFromNow: 1 });
    if (!feeCountPerDay) {
      res.status(500).end();
      return;
    }
    const resp = {
      date: format(feeCountPerDay.timestamp, "yyyy-MM-dd"),
      collected_fee_in_yoctonear: feeCountPerDay.tokensBurnt,
    };
    res.send(resp);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Handler ${req.url} failed:`, error);
    res.status(502).send(error);
  }
};

export default handler;
