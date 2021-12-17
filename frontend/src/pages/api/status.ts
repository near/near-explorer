import { NextApiHandler } from "next";
import { ExplorerApi } from "../../libraries/explorer-wamp";

const handler: NextApiHandler = async (req, res) => {
  try {
    await new ExplorerApi(req).call("nearcore-status");
  } catch (error) {
    res.status(502).send(error);
    return;
  }
  res.send({});
};

export default handler;
