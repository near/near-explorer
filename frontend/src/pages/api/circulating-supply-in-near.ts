import { NextApiHandler } from "next";

import {
  isNetworkOffline,
  respondNetworkOffline,
} from "@explorer/frontend/libraries/api";
import { getNearNetworkName } from "@explorer/frontend/libraries/config";
import { getTrpcClient } from "@explorer/frontend/libraries/trpc";

const handler: NextApiHandler = async (req, res) => {
  // This API is currently providing computed estimation based on the inflation, so we only have it for mainnet
  const networkName = getNearNetworkName(req.query, req.headers.host);
  if (networkName !== "mainnet") {
    res.status(404).end();
    return;
  }
  if (isNetworkOffline(networkName)) {
    return respondNetworkOffline(res, networkName);
  }

  try {
    const latestCirculatingSupply = await getTrpcClient(networkName).query(
      "stats.latestCirculatingSupply"
    );
    const supplyInYoctoNEAR = latestCirculatingSupply.supply;
    res.send(supplyInYoctoNEAR.substr(0, supplyInYoctoNEAR.length - 24));
  } catch (error) {
    console.error(`Handler ${req.url} failed:`, error);
    res.status(502).send(error);
  }
};

export default handler;
