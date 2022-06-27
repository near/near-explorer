import {
  queryAccountFungibleTokenContractIds,
  queryAccountFungibleTokenHistory,
} from "../database/queries";
import * as nearApi from "../utils/near";

// https://nomicon.io/Standards/Tokens/FungibleToken/Metadata
type FungibleTokenMetadata = {
  spec: string;
  name: string;
  symbol: string;
  icon: string | null;
  reference: string | null;
  reference_hash: string | null;
  decimals: number;
};

const base64ImageRegex = /^data:image/;
const validateBase64Image = (base64Image: string | null): string | null => {
  if (!base64Image) {
    return null;
  }
  return base64ImageRegex.test(base64Image) ? base64Image : null;
};

type AccountFungibleToken = {
  symbol: string;
  decimals: number;
  name: string;
  authorAccountId: string;
  icon: string | null;
  balance: string;
};

export const getFungibleTokens = async (
  accountId: string
): Promise<AccountFungibleToken[]> => {
  const contractIds = await queryAccountFungibleTokenContractIds(accountId);
  const tokens = await Promise.all(
    contractIds.map(async (contractId) => {
      const balance = await nearApi.callViewMethod<string>(
        contractId,
        "ft_balance_of",
        { account_id: accountId }
      );
      if (balance === "0") {
        return null;
      }
      const fungibleTokenMetadata =
        await nearApi.callViewMethod<FungibleTokenMetadata>(
          contractId,
          "ft_metadata",
          {}
        );

      return {
        symbol: fungibleTokenMetadata.symbol,
        decimals: fungibleTokenMetadata.decimals,
        name: fungibleTokenMetadata.name,
        authorAccountId: contractId,
        icon: validateBase64Image(fungibleTokenMetadata.icon),
        balance,
      };
    })
  );
  return tokens.filter((token): token is AccountFungibleToken =>
    Boolean(token)
  );
};

type AccountFungibleTokenHistoryElement = {
  counterparty: string;
  direction: "in" | "out";
  amount: string;
  transactionHash: string;
  receiptId: string;
  timestamp: number;
};

export const getFungibleTokenHistory = async (
  accountId: string,
  tokenAuthorAccountId: string
): Promise<{
  elements: AccountFungibleTokenHistoryElement[];
  baseAmount: string;
}> => {
  const elements = await queryAccountFungibleTokenHistory(
    accountId,
    tokenAuthorAccountId
  );
  const baseAmount = await nearApi.callViewMethod<string>(
    tokenAuthorAccountId,
    "ft_balance_of",
    { account_id: accountId },
    { block_id: Number(elements[elements.length - 1].blockHeight) - 1 }
  );
  return {
    baseAmount,
    elements: elements.map((element) => ({
      counterparty:
        element.prevAccountId === accountId
          ? element.nextAccountId
          : element.prevAccountId,
      direction: element.prevAccountId === accountId ? "out" : "in",
      amount: element.amount,
      transactionHash: element.transactionHash,
      receiptId: element.receiptId,
      timestamp: parseInt(element.timestamp),
    })),
  };
};
