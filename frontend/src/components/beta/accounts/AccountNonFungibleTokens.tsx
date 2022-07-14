import * as React from "react";
import Image from "next/image";

import { styled } from "../../../libraries/styles";
import { trpc } from "../../../libraries/trpc";

import ListHandler from "../../utils/ListHandler";
import {
  AccountNonFungibleToken,
  AccountNonFungibleTokenElement,
} from "../../../types/common";
import { NonFungibleTokensAccountPageOptions } from "../../../hooks/use-account-page-options";
import AccountNonFungibleTokensHistory from "./AccountNonFungibleTokensHistory";
import NFTMedia from "../common/NFTMedia";

const TOKENS_PER_PAGE = 4;

const Wrapper = styled("div", {
  display: "flex",
});

const ContractItem = styled(Wrapper, {
  cursor: "pointer",
  maxWidth: 345,
  border: "1px solid #ededed",
  transition: "border-color .15s ease-in-out",
  borderRadius: 10,
  paddingHorizontal: 20,
  paddingVertical: 16,

  "&:hover": {
    borderColor: "#1e93ff",
  },

  variants: {
    active: {
      true: {
        borderColor: "#1e93ff",
      },
    },
  },
});

const ContractsWrapper = styled("div", {
  display: "flex",
  flex: 1,
  flexDirection: "column",

  [`& ${ContractItem}:not(:first-child)`]: {
    marginTop: 12,
  },
});

const TokensWrapper = styled(Wrapper, {
  flexWrap: "wrap",
  flex: 2,
});

const Token = styled(ContractItem, {
  margin: 10,
  border: "1px solid #e7e7e7",
  maxWidth: "auto",
  padding: 0,
  width: 225,
  height: 280,
  flexDirection: "column",
  boxSizing: "content-box",
});

const TokenImage = styled("div", {
  width: 225,
  height: 200,
  borderTopLeftRadius: "inherit",
  borderTopRightRadius: "inherit",
  marginBottom: 16,
  overflow: "hidden",
  position: "relative",
});

const TokenBody = styled("div", {
  display: "flex",
  flexDirection: "column",
  marginHorizontal: 16,
});

const TokenLogo = styled("div", {
  position: "relative",
  width: 14,
  height: 14,
  marginRight: 6,
});

const TokenName = styled("div", {
  fontWeight: 700,
  fontSize: 14,
  lineHeight: "150%",
  marginBottom: 16,

  "& span": {
    display: "block",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
});

const TokenInfo = styled("div", {
  display: "flex",
  alignItems: "center",
  marginBottom: 16,

  [`& ${TokenName}`]: {
    marginBottom: 0,
  },
});

type ItemProps = {
  token: AccountNonFungibleTokenElement;
  onClick: React.ReactEventHandler;
  modalOpen: boolean;
};

const AccountNonFungibleTokenView: React.FC<ItemProps> = React.memo(
  ({ token, onClick, modalOpen }) => {
    return (
      <>
        <Token onClick={onClick} active={modalOpen}>
          <TokenImage>
            <NFTMedia src={token.metadata.media} />
          </TokenImage>

          <TokenBody>
            <TokenName>
              <span>{token.metadata.title}</span>
            </TokenName>

            <TokenInfo>
              <TokenLogo>
                {token.contractMetadata.icon ? (
                  <Image src={token.contractMetadata.icon} layout="fill" />
                ) : null}
              </TokenLogo>
              <TokenName>{token.contractMetadata.name}</TokenName>
            </TokenInfo>
          </TokenBody>
        </Token>
        {modalOpen ? (
          <AccountNonFungibleTokensHistory token={token} onClick={onClick} />
        ) : null}
      </>
    );
  }
);

type ContractProps = {
  contract: string;
  accountId: string;
};

const parser = (result: AccountNonFungibleToken) => result.items;

const AccountNonFungibleTokens: React.FC<ContractProps> = React.memo(
  ({ contract, accountId }) => {
    const [selectedId, setSelectedId] = React.useState(null);
    const showModal = React.useCallback(
      (id) => () => setSelectedId((prevId) => (prevId === id ? null : id)),
      [setSelectedId]
    );

    const query = trpc.useInfiniteQuery(
      [
        "account.nonFungibleTokens",
        {
          contractId: contract,
          accountId,
          limit: TOKENS_PER_PAGE,
        },
      ],
      {
        getNextPageParam: (lastPage) => lastPage.cursor,
      }
    );

    return (
      <TokensWrapper>
        {query.status === "error" ? (
          <div>Failed to load NFTs</div>
        ) : (
          <ListHandler query={query} parser={parser}>
            {(items) => {
              return (
                <TokensWrapper>
                  {items.map((token) => (
                    <AccountNonFungibleTokenView
                      key={token.tokenId}
                      token={token}
                      onClick={showModal(token.tokenId)}
                      modalOpen={selectedId === token.tokenId}
                    />
                  ))}
                </TokensWrapper>
              );
            }}
          </ListHandler>
        )}
      </TokensWrapper>
    );
  }
);

type Props = {
  options: NonFungibleTokensAccountPageOptions;
};

const AccountNonFungibleTokensView: React.FC<Props> = React.memo(
  ({ options }) => {
    const [selectedContract, setContract] = React.useState(null);
    const setActiveContract = React.useCallback(
      (contract) => () => setContract(contract),
      [setContract]
    );

    const query = trpc.useQuery([
      "account.nonFungibleTokenContracts",
      { accountId: options.accountId },
    ]);
    const contracts = query.data || [];

    if (contracts.length === 0) {
      return <div>No collectibles yet!</div>;
    }

    return (
      <Wrapper>
        <ContractsWrapper>
          {contracts.map((contract) => (
            <ContractItem
              key={contract}
              onClick={setActiveContract(contract)}
              active={selectedContract === contract}
            >
              {contract}
            </ContractItem>
          ))}
        </ContractsWrapper>
        {selectedContract ? (
          <AccountNonFungibleTokens
            contract={selectedContract}
            accountId={options.accountId}
          />
        ) : null}
      </Wrapper>
    );
  }
);

export default AccountNonFungibleTokensView;
