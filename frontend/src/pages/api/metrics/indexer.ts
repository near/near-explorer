import { NextApiHandler } from "next";
import json2Prom from "json-2-prom";
import { getNearNetworkName } from "../../../libraries/config";
import { getTrpcClient } from "../../../libraries/trpc";
import {
  isNetworkOffline,
  respondNetworkOffline,
} from "../../../libraries/api";

const handler: NextApiHandler = async (req, res) => {
  try {
    const networkName = getNearNetworkName(req.query, req.headers.host);
    if (isNetworkOffline(networkName)) {
      return respondNetworkOffline(res, networkName);
    }
    const trpcClient = getTrpcClient(networkName);
    const rpcFinalBlock = await trpcClient.query("block.final", {
      source: "rpc",
    });
    const indexerFinalBlock = await trpcClient.query("block.final", {
      source: "indexer",
    });

    const prometheusResponse = json2Prom([
      {
        name: "rpc_latest_block_height",
        help: "RPC latest block height",
        type: "COUNTER",
        metrics: [
          {
            value: rpcFinalBlock.height,
          },
        ],
      },
      {
        name: "indexer_latest_block_height",
        help: "Indexer latest block height",
        type: "COUNTER",
        metrics: [
          {
            value: indexerFinalBlock.height,
          },
        ],
      },
    ]);

    res.send(prometheusResponse.join("\n"));
  } catch (error) {
    console.error(`Handler ${req.url} failed:`, error);
    res.status(502).send(error);
  }
};

export default handler;
