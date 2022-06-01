import { NextApiHandler } from "next";
import { getNearNetworkName } from "../../libraries/config";
import { getTrpcClient } from "../../libraries/trpc";

const handler: NextApiHandler = async (req, res) => {
  try {
    const networkName = getNearNetworkName(req.query, req.headers.host);
    await getTrpcClient(networkName).query("nearcore-status");
  } catch (error) {
    res.status(502).send(error);
    return;
  }
  res.send({});
};

export default handler;
