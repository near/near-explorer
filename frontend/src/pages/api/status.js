import { ExplorerApi } from "../../libraries/explorer-wamp";

export default async function (req, res) {
  try {
    await new ExplorerApi(req).call("nearcore-status");
  } catch (error) {
    res.status(400).send(error);
    return;
  }
  res.send({});
}
