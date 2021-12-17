import { NextApiHandler } from "next";
import { ExplorerApi } from "../../../libraries/explorer-wamp";
import BlocksApi from "../../../libraries/explorer-wamp/blocks";
import json2Prom from "json-2-prom";

const handler: NextApiHandler = async (req, res) => {
  try {
    const rpcFinalBlock = await new ExplorerApi(req).call<any>(
      "nearcore-final-block"
    );
    const indexerFinalBlock = await new BlocksApi(req).getBlocks(1);

    const prometheusResponse = json2Prom([
      {
        name: "rpc_latest_block_height",
        help: "RPC latest block height",
        type: "COUNTER",
        metrics: [
          {
            value: rpcFinalBlock.header.height,
          },
        ],
      },
      {
        name: "indexer_latest_block_height",
        help: "Indexer latest block height",
        type: "COUNTER",
        metrics: [
          {
            value: indexerFinalBlock[0].height,
          },
        ],
      },
    ]);

    res.send(prometheusResponse.join("\n"));
  } catch (error) {
    console.error(error);
    res.status(502).send(error);
  }
};

export default handler;
