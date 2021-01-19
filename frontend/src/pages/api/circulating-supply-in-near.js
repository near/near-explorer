import { getNearNetwork } from "../../libraries/config";
import { getCirculatingSupplyToday } from "./circulating-supply";

export default async function (req, res) {
  // This API is currenlty providing computed estimation based on the inflation, so we only have it for mainnet
  const nearNetwork = getNearNetwork(req.socket.hostname);
  if (nearNetwork.name !== "mainnet") {
    res.status(404).end();
    return;
  }

  const circulatingSupplyTodayInYoctoNEAR = getCirculatingSupplyToday().amount;
  const circulatingSupplyTodayInNEAR = circulatingSupplyTodayInYoctoNEAR.substr(
    0,
    circulatingSupplyTodayInYoctoNEAR.length - 24
  );

  res.send(circulatingSupplyTodayInNEAR);
}
