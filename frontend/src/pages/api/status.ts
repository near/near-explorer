import { NextApiHandler } from "next";
import { isNetworkOffline, respondNetworkOffline } from "../../libraries/api";
import { getNearNetworkName } from "../../libraries/config";
import { getTrpcClient } from "../../libraries/trpc";

const handler: NextApiHandler = async (req, res) => {
  try {
    const networkName = getNearNetworkName(req.query, req.headers.host);
    if (isNetworkOffline(networkName)) {
      return respondNetworkOffline(res, networkName);
    }
    await getTrpcClient(networkName).query("utils.protocolVersion");
  } catch (error) {
    res.status(502).send(error);
    return;
  }
  res.send({});
};

export default handler;
