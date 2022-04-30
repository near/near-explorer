import { NextApiHandler } from "next";
import json2Prom from "json-2-prom";
import { getNearNetwork } from "../../../libraries/config";
import { getFetcher } from "../../../libraries/transport";

const handler: NextApiHandler = async (req, res) => {
  try {
    const nearNetwork = getNearNetwork(req.query, req.headers.host);
    const fetcher = getFetcher(nearNetwork);
    const rpcFinalBlock = await fetcher("nearcore-final-block", []);
    const indexerFinalBlock = await fetcher("blocks-list", [1, null]);

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
    console.error(`Handler ${req.url} failed:`, error);
    res.status(502).send(error);
  }
};

export default handler;
