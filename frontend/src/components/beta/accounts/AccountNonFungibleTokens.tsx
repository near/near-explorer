import * as React from "react";

import Image from "next/legacy/image";
import { Spinner } from "react-bootstrap";

import { AccountNonFungibleTokenElement } from "@/common/types/procedures";
import { TRPCInfiniteQueryOutput } from "@/common/types/trpc";
import AccountNonFungibleTokensHistory from "@/frontend/components/beta/accounts/AccountNonFungibleTokensHistory";
import NFTMedia from "@/frontend/components/beta/common/NFTMedia";
import ErrorMessage from "@/frontend/components/utils/ErrorMessage";
import ListHandler from "@/frontend/components/utils/ListHandler";
import { NonFungibleTokensAccountPageOptions } from "@/frontend/hooks/use-account-page-options";
import { styled } from "@/frontend/libraries/styles";
import { trpc } from "@/frontend/libraries/trpc";

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
  ({ token, onClick, modalOpen }) => (
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
  )
);

type ContractProps = {
  contract: string;
  accountId: string;
};

const parser = (result: TRPCInfiniteQueryOutput<"account.nonFungibleTokens">) =>
  result.items;

const AccountNonFungibleTokens: React.FC<ContractProps> = React.memo(
  ({ contract, accountId }) => {
    const [selectedId, setSelectedId] = React.useState<string | null>(null);
    const showModal = React.useCallback<
      (id: string) => React.ReactEventHandler
    >(
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
          <ListHandler<
            "account.nonFungibleTokens",
            ReturnType<typeof parser>[number]
          >
            query={query}
            parser={parser}
          >
            {(items) => (
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
            )}
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
    const [selectedContract, setContract] = React.useState<string | null>(null);
    const setActiveContract = React.useCallback<
      (contract: string) => React.MouseEventHandler
    >((contract) => () => setContract(contract), [setContract]);

    const contractQuery = trpc.useQuery([
      "account.nonFungibleTokenContracts",
      { accountId: options.accountId },
    ]);
    if (contractQuery.status === "loading" || contractQuery.status === "idle") {
      return (
        <Wrapper>
          <Spinner animation="border" />
        </Wrapper>
      );
    }
    if (contractQuery.status === "error") {
      return (
        <Wrapper>
          <ErrorMessage onRetry={contractQuery.refetch}>
            {contractQuery.error.message}
          </ErrorMessage>
        </Wrapper>
      );
    }

    if (contractQuery.data.length === 0) {
      return <Wrapper>No collectibles yet!</Wrapper>;
    }

    return (
      <Wrapper>
        <ContractsWrapper>
          {contractQuery.data.map((contract) => (
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
