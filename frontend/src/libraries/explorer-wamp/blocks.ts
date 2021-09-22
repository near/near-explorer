import BN from "bn.js";

import { ExplorerApi } from ".";

export interface BlockInfo {
  hash: string;
  height: number;
  timestamp: number;
  prevHash: string;
  transactionsCount: number;
}

export type DetailedBlockInfo = BlockInfo & {
  totalSupply: BN;
  gasPrice: BN;
  gasUsed: BN;
  authorAccountId: string;
  receiptsCount: number;
};

export default class BlocksApi extends ExplorerApi {
  async getBlocks(
    limit = 15,
    paginationIndexer?: number
  ): Promise<BlockInfo[]> {
    try {
      let blocks = await this.call<BlockInfo[]>("select:INDEXER_BACKEND", [
        `SELECT
            blocks.block_hash AS hash,
            blocks.block_height AS height,
            DIV(blocks.block_timestamp, 1000*1000) AS timestamp,
            blocks.prev_block_hash AS prev_hash,
            COUNT(transactions.transaction_hash) AS transactions_count
          FROM (
            SELECT blocks.block_hash AS block_hash
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
          LEFT JOIN blocks ON blocks.block_hash = innerblocks.block_hash
          GROUP BY blocks.block_hash
          ORDER BY blocks.block_timestamp DESC`,
        {
          limit,
          paginationIndexer,
        },
      ]);
      blocks = blocks.map((block: any) => {
        return {
          hash: block.hash,
          height: parseInt(block.height),
          timestamp: parseInt(block.timestamp),
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

  async getBlockInfo(blockId: string | number): Promise<DetailedBlockInfo> {
    try {
      let receiptsCount;
      let gasUsedInBlock;

      const block = await this.call<any>("select:INDEXER_BACKEND", [
        `SELECT
            blocks.block_hash AS hash,
            blocks.block_height AS height,
            DIV(blocks.block_timestamp, 1000*1000) AS timestamp,
            blocks.prev_block_hash AS prev_hash,
            blocks.gas_price AS gas_price,
            blocks.total_supply AS total_supply,
            blocks.author_account_id AS author_account_id,
            COUNT(transactions.transaction_hash) AS transactions_count
          FROM (
            SELECT blocks.block_hash AS block_hash
            FROM blocks
            ${
              typeof blockId === "string"
                ? `WHERE blocks.block_hash = :blockId`
                : `WHERE blocks.block_height = :blockId`
            }
          ) as innerblocks
          LEFT JOIN transactions ON transactions.included_in_block_hash = innerblocks.block_hash
          LEFT JOIN blocks ON blocks.block_hash = innerblocks.block_hash
          GROUP BY blocks.block_hash
          ORDER BY blocks.block_timestamp DESC`,
        {
          blockId,
        },
      ]).then((it) => (it.length === 0 ? undefined : it[0]));

      if (typeof blockId === "string") {
        receiptsCount = await this.call<any>("select:INDEXER_BACKEND", [
          `SELECT
            COUNT(receipts.receipt_id)
          FROM receipts
          WHERE receipts.included_in_block_hash = :blockId
          AND receipts.receipt_kind = 'ACTION'`,
          {
            blockId,
          },
        ]).then((it) => (it.length === 0 ? undefined : it[0].count));
      }

      if (block === undefined) {
        throw new Error("block not found");
      } else {
        const gasUsedInChunks = await this.call<any>("select:INDEXER_BACKEND", [
          `SELECT gas_used FROM chunks WHERE included_in_block_hash = :block_hash`,
          {
            block_hash: block.hash,
          },
        ]);
        gasUsedInBlock = gasUsedInChunks.reduce(
          (currentGas: BN, chunk: { gas_used: string }) => {
            currentGas.iadd(new BN(chunk.gas_used));
            return currentGas;
          },
          new BN(0)
        );
      }

      return {
        hash: block.hash,
        prevHash: block.prev_hash,
        height: parseInt(block.height),
        timestamp: parseInt(block.timestamp),
        transactionsCount: block.transactions_count,
        totalSupply: new BN(block.total_supply),
        gasUsed: gasUsedInBlock,
        gasPrice: new BN(block.gas_price),
        authorAccountId: block.author_account_id,
        receiptsCount,
      } as DetailedBlockInfo;
    } catch (error) {
      console.error("Blocks.getBlockInfo failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  }
}
