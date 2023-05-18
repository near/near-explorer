import { NextApiHandler } from "next";

import {
  isNetworkOffline,
  respondNetworkOffline,
} from "@/frontend/libraries/api";
import { getNearNetworkName } from "@/frontend/libraries/config";
import { getTrpcClient } from "@/frontend/libraries/trpc";

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
    const response = await getTrpcClient(networkName).query(
      "stats.latestCirculatingSupply"
    );
    res.send({
      timestamp: response.timestamp,
      circulating_supply_in_yoctonear: response.supply,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Handler ${req.url} failed:`, error);
    res.status(502).send(error);
  }
};

export default handler;
