import { NextApiHandler } from "next";
import { getNearNetworkName } from "../../libraries/config";
import { getFetcher } from "../../libraries/transport";

const handler: NextApiHandler = async (req, res) => {
  try {
    const networkName = getNearNetworkName(req.query, req.headers.host);
    await getFetcher(networkName)("nearcore-status", []);
  } catch (error) {
    res.status(502).send(error);
    return;
  }
  res.send({});
};

export default handler;
