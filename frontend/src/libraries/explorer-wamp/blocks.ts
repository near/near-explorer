import { ExplorerApi } from ".";
import BN from "bn.js";

export interface BlockInfo {
  hash: string;
  height: number;
  timestamp: number;
  prevHash: string;
  transactionsCount: number;
  gasPrice?: string;
  gasUsed?: string;
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
      let blocks;
      if (this.selectOption === "Legacy") {
        blocks = await this.call<BlockInfo[]>("select", [
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
      } else {
        blocks = await this.call<BlockInfo[]>("select:INDEXER_BACKEND", [
          `SELECT blocks.block_hash as hash, blocks.block_height as height, blocks.block_timestamp as timestamp, 
            blocks.prev_block_hash as prev_hash, COUNT(transactions.transaction_hash) as transactions_count
          FROM (
            SELECT blocks.block_hash as block_hash 
            FROM blocks
            ${
              paginationIndexer
                ? `WHERE blocks.block_timestamp < :paginationIndexer`
                : ""
            }
            ORDER BY blocks.block_height DESC
            LIMIT :limit
          ) as innerblocks
          LEFT JOIN transactions ON transactions.included_in_block_hash = innerblocks.block_hash
          LEFT JOIN blocks on blocks.block_hash = innerblocks.block_hash
          GROUP BY blocks.block_hash
          ORDER BY blocks.block_timestamp DESC`,
          {
            limit,
            paginationIndexer,
          },
        ]);
      }
      blocks = blocks.map((block: any) => {
        return {
          hash: block.hash,
          height: block.height,
          timestamp:
            typeof block.timestamp === "string"
              ? new BN(block.timestamp).div(new BN(10 ** 6)).toNumber()
              : block.timestamp,
          prevHash: block.prev_hash,
          transactionsCount: block.transactions_count,
        };
      });
      return blocks;
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
          `SELECT blocks.block_hash as hash, blocks.block_height as height, blocks.block_timestamp as timestamp, 
            blocks.prev_block_hash as prev_hash, blocks.gas_price as gas_price, 
            COUNT(transactions.transaction_hash) as transactions_count
            FROM (
              SELECT blocks.block_hash as block_hash 
              FROM blocks
              ${
                typeof blockId === "string"
                  ? `WHERE blocks.block_hash = :blockId`
                  : `WHERE blocks.block_height = :blockId`
              } 
            ) as innerblocks
            LEFT JOIN transactions ON transactions.included_in_block_hash = innerblocks.block_hash
            LEFT JOIN blocks on blocks.block_hash = innerblocks.block_hash
            GROUP BY blocks.block_hash
            ORDER BY blocks.block_timestamp DESC`,
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
            `SELECT gas_used FROM chunks WHERE block_hash = :block_hash`,
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
        let gasUsedArray = gasUsedResult.map(
          (gas: any) => new BN(gas.gas_used)
        );
        let gasUsed = gasUsedArray.reduce(
          (gas: BN, currentGas: BN) => gas.add(currentGas),
          new BN(0)
        );
        block.gasUsed = gasUsed.toString();
      }
      return {
        gasUsed: block.gasUsed,
        gasPrice: block.gas_price,
        hash: block.hash,
        height: block.height,
        prevHash: block.prev_hash,
        timestamp:
          typeof block.timestamp === "string"
            ? new BN(block.timestamp).div(new BN(10 ** 6)).toNumber()
            : block.timestamp,
        transactionsCount: block.transactions_count,
      } as BlockInfo;
    } catch (error) {
      console.error("Blocks.getBlockInfo failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  }
}
