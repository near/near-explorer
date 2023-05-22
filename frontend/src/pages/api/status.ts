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
    await getTrpcClient(networkName).utils.protocolVersion.query();
  } catch (error) {
    res.status(502).send(error);
    return;
  }
  res.send({});
};

export default handler;
