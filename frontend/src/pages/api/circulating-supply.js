import { getNearNetwork } from "../../libraries/config";
import DetailsApi from "../../libraries/explorer-wamp/details";

export default async function (req, res) {
  // This API is currenlty providing computed estimation based on the inflation, so we only have it for mainnet
  const nearNetwork = getNearNetwork(req.socket.hostname);
  if (nearNetwork.name !== "mainnet") {
    res.status(404).end();
    return;
  }

  try {
    const totalSupply = await new DetailsApi(req).calculateCirculatingSupply();
    res.send(totalSupply);
  } catch (error) {
    console.error(error);
    res.status(502).send(error);
    return;
  }
}
