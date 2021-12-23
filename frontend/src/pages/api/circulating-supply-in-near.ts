import { NextApiHandler } from "next";
import { getNearNetwork } from "../../libraries/config";
import { ExplorerApi } from "../../libraries/explorer-wamp";

const handler: NextApiHandler = async (req, res) => {
  // This API is currently providing computed estimation based on the inflation, so we only have it for mainnet
  const nearNetwork = getNearNetwork(req);
  if (nearNetwork.name !== "mainnet") {
    res.status(404).end();
    return;
  }

  try {
    const supply = await new ExplorerApi(req).call<{
      timestamp: string;
      circulating_supply_in_yoctonear: string;
    }>("get-latest-circulating-supply");
    const supplyInYoctoNEAR = supply.circulating_supply_in_yoctonear;
    res.send(supplyInYoctoNEAR.substr(0, supplyInYoctoNEAR.length - 24));
  } catch (error) {
    console.error(error);
    res.status(502).send(error);
  }
};

export default handler;
