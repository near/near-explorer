import { getNearNetwork } from "../../libraries/config";
import { getCirculatingSupplyToday } from "./circulating-supply";

export default async function (req, res) {
  // This API is currenlty providing computed estimation based on the inflation, so we only have it for mainnet
  const nearNetwork = getNearNetwork(req.headers.host);
  if (nearNetwork.name !== "mainnet") {
    res.status(404).end();
    return;
  }

  try {
    const circulatingSupplyTodayInYoctoNEAR = (
      await getCirculatingSupplyToday(req)
    ).amount;
    const circulatingSupplyTodayInNEAR = circulatingSupplyTodayInYoctoNEAR.substr(
      0,
      circulatingSupplyTodayInYoctoNEAR.length - 24
    );

    res.send(circulatingSupplyTodayInNEAR);
  } catch (error) {
    console.error(error);
    res.status(502).send(error);
  }
}
