import { ExplorerApi } from ".";
import BN from "bn.js";

export interface BlockInfo {
  hash: string;
  height: number;
  timestamp: number;
  prev_hash: string;
  transactions_count: number;
  gas_price?: string;
  gasUsed?: string;
  isFinal?: boolean;
}

export default class BlocksApi extends ExplorerApi {
  selectOption: string;
  constructor() {
    super();
    this.selectOption =
      this.nearNetwork.name === "testnet" ? "Indexer" : "Legacy";
  }

  async getBlocks(
    limit = 15,
    paginationIndexer?: number
  ): Promise<BlockInfo[]> {
    try {
      if (this.selectOption === "Legacy") {
        return await this.call<BlockInfo[]>("select", [
          `SELECT blocks.*, COUNT(transactions.hash) as transactions_count
            FROM (
              SELECT blocks.hash, blocks.height, blocks.timestamp, blocks.prev_hash 
              FROM blocks
              ${
                paginationIndexer
                  ? `WHERE blocks.timestamp < :paginationIndexer`
                  : ""
              }
              ORDER BY blocks.height DESC
              LIMIT :limit
            ) as blocks
            LEFT JOIN transactions ON transactions.block_hash = blocks.hash
            GROUP BY blocks.hash
            ORDER BY blocks.timestamp DESC`,
          {
            limit,
            paginationIndexer,
          },
        ]);
      }
      return await this.call<BlockInfo[]>("select:INDEXER_BACKEND", [
        `SELECT innerblocks.*, COUNT(transactions.included_in_block_hash) as transactions_count
        FROM (
          SELECT blocks.block_hash as hash, blocks.block_height as height, 
                blocks.block_timestamp as timestamp,blocks.prev_block_hash as prev_hash 
          FROM blocks
          ${
            paginationIndexer
              ? `WHERE blocks.block_timestamp < :paginationIndexer`
              : ""
          }
          ORDER BY blocks.block_height DESC
          LIMIT :limit
        ) as innerblocks
        LEFT JOIN transactions ON transactions.included_in_block_hash = innerblocks.hash
        GROUP BY innerblocks.hash, innerblocks.height, innerblocks.timestamp, innerblocks.prev_hash
        ORDER BY innerblocks.timestamp DESC`,
        {
          limit,
          paginationIndexer,
        },
      ]);
    } catch (error) {
      console.error("Blocks.getBlocks failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  }

  async getBlockInfo(blockId: string | number): Promise<BlockInfo> {
    try {
      let block;
      if (this.selectOption === "Legacy") {
        block = await this.call<any>("select", [
          `SELECT blocks.*, COUNT(transactions.hash) as transactions_count
            FROM (
              SELECT blocks.hash, blocks.height, blocks.timestamp, blocks.prev_hash as prev_hash, 
                    blocks.gas_price as gas_price
              FROM blocks
              WHERE blocks.hash = :blockId OR blocks.height = :blockId
            ) as blocks
            LEFT JOIN transactions ON transactions.block_hash = blocks.hash`,
          {
            blockId,
          },
        ]).then((it) => (it.length === 0 ? undefined : it[0]));
      } else {
        block = await this.call<any>("select:INDEXER_BACKEND", [
          `SELECT innerblocks.*, COUNT(transactions.included_in_block_hash) as transactions_count
          FROM (
            SELECT blocks.block_hash as hash, blocks.block_height as height, 
                blocks.block_timestamp as timestamp,blocks.prev_block_hash as prev_hash,
                blocks.gas_price as gas_price
            FROM blocks
            ${
              typeof blockId === "string"
                ? `WHERE blocks.block_hash = :blockId`
                : `WHERE blocks.block_height = :blockId`
            } 
          ) as innerblocks
          LEFT JOIN transactions ON transactions.included_in_block_hash = innerblocks.hash
          GROUP BY innerblocks.hash, innerblocks.height, innerblocks.timestamp, innerblocks.prev_hash, innerblocks.gas_price`,
          {
            blockId,
          },
        ]).then((it) => (it.length === 0 ? undefined : it[0]));
      }

      if (block === undefined) {
        throw new Error("block not found");
      } else {
        let gasUsedResult;
        if (this.selectOption === "Legacy") {
          gasUsedResult = await this.call<any>("select", [
            `SELECT gas_used FROM chunks WHERE block_hash = :block_hash AND height_included = :block_height`,
            {
              block_hash: block.hash,
            },
          ]);
        } else {
          gasUsedResult = await this.call<any>("select:INDEXER_BACKEND", [
            `SELECT gas_used FROM chunks WHERE included_in_block_hash = :block_hash`,
            {
              block_hash: block.hash,
            },
          ]);
        }

        console.log(gasUsedResult);
        let gasUsedArray = gasUsedResult.map(
          (gas: any) => new BN(gas.gas_used)
        );
        let gasUsed = gasUsedArray.reduce(
          (gas: BN, currentGas: BN) => gas.add(currentGas),
          new BN(0)
        );
        block.gasUsed = gasUsed.toString();
      }
      console.log(block);
      return block as BlockInfo;
    } catch (error) {
      console.error("Blocks.getBlockInfo failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  }
}
