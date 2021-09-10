import { getNearNetwork } from "../../libraries/config";
import { ExplorerApi } from "../../libraries/explorer-wamp";
import BlocksApi from "../../libraries/explorer-wamp/blocks";

export default async function (req, res) {
  // This endpoint provides the status of Indexer for Explorer
  // It checks the latest block height in indexer database
  // and the latest block height from JSON RPC
  // If the difference in between 30 blocks it is considered as fine
  // otherwise not fine

  try {
    const rpcFinalBlock = await new ExplorerApi(req).call(
      "nearcore-final-block"
    );
    const indexerFinalBlock = await new BlocksApi(req).getBlocks(1, null);

    const statusResponse = {
      rpc_latest_block_height: rpcFinalBlock.header.height,
      indexer_latest_block_height: indexerFinalBlock[0].height,
    };
    res.status(200).send(statusResponse);
  } catch (error) {
    console.error(error);
    res.status(502).send(error);
  }
}
