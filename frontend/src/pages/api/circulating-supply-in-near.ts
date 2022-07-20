import { NextApiHandler } from "next";
import { getTrpcClient } from "../../libraries/trpc";
import { getNearNetworkName } from "../../libraries/config";

const handler: NextApiHandler = async (req, res) => {
  // This API is currently providing computed estimation based on the inflation, so we only have it for mainnet
  const networkName = getNearNetworkName(req.query, req.headers.host);
  if (networkName !== "mainnet") {
    res.status(404).end();
    return;
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
