import { NextApiHandler } from "next";
import { getFetcher } from "../../libraries/transport";
import { getNearNetworkName } from "../../libraries/config";

const handler: NextApiHandler = async (req, res) => {
  // This API is currently providing computed estimation based on the inflation, so we only have it for mainnet
  const networkName = getNearNetworkName(req.query, req.headers.host);
  if (networkName !== "mainnet") {
    res.status(404).end();
    return;
  }

  try {
    const supply = await getFetcher(networkName)(
      "get-latest-circulating-supply",
      []
    );
    const supplyInYoctoNEAR = supply.circulating_supply_in_yoctonear;
    res.send(supplyInYoctoNEAR.substr(0, supplyInYoctoNEAR.length - 24));
  } catch (error) {
    console.error(`Handler ${req.url} failed:`, error);
    res.status(502).send(error);
  }
};

export default handler;
