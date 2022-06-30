import * as React from "react";
import Image from "next/image";

import { styled } from "../../../libraries/styles";
import { rgbDataURL } from "../../../libraries/rgbplaceholder";
import { trpc } from "../../../libraries/trpc";

import ListHandler from "../../utils/ListHandler";
import { AccountNonFungibleToken } from "../../../types/common";
import { NonFungibleTokensAccountPageOptions } from "../../../hooks/use-account-page-options";
import AccountNonFungibleTokensHistory from "./AccountNonFungibleTokensHistory";
import Img from "../common/Img";

const TOKENS_PER_PAGE = 20;

const Wrapper = styled("div", {
  display: "flex",
  flexWrap: "wrap",
});

const Token = styled("div", {
  margin: 10,
  border: "1px solid #e7e7e7",
  borderRadius: 10,
  width: 225,
  height: 280,
  display: "flex",
  flexDirection: "column",
  cursor: "pointer",
  transition: "border-color .15s ease-in-out",
  boxSizing: "content-box",

  "&:hover": {
    borderColor: "#1e93ff",
  },
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
  token: AccountNonFungibleToken;
  onClick: React.ReactEventHandler;
  modalOpen: boolean;
};

const AccountFungibleTokenView: React.FC<ItemProps> = React.memo(
  ({ token, onClick, modalOpen }) => {
    return (
      <>
        <Token
          onClick={onClick}
          css={modalOpen ? { borderColor: "#1e93ff" } : {}}
        >
          <TokenImage>
            <Img src={token.metadata.media} />
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

type Props = {
  options: NonFungibleTokensAccountPageOptions;
};

const AccountNonFungibleTokensView: React.FC<Props> = React.memo(
  ({ options }) => {
    const [selectedId, setSelectedId] = React.useState(null);
    const showModal = React.useCallback(
      (id) => () => setSelectedId((prevId) => (prevId === id ? null : id)),
      [setSelectedId]
    );
    const query = trpc.useInfiniteQuery(
      [
        "account-non-fungible-tokens",
        {
          accountId: options.accountId,
          limit: TOKENS_PER_PAGE,
        },
      ],
      {
        getNextPageParam: (lastPage) => {
          const lastElement = lastPage[lastPage.length - 1];
          if (!(lastElement.index + 1 < lastElement.totalNftCount)) {
            return;
          }
          return lastElement.index + 1;
        },
      }
    );

    console.log("query: ", query);

    return (
      <ListHandler query={query}>
        {(items) => {
          if (items.length === 0) {
            return <div>No collectibles yet!</div>;
          }
          return (
            <Wrapper>
              {items.map((token) => (
                <AccountFungibleTokenView
                  key={token.tokenId}
                  token={token}
                  onClick={showModal(token.tokenId)}
                  modalOpen={selectedId === token.tokenId}
                />
              ))}
            </Wrapper>
          );
        }}
      </ListHandler>
    );
  }
);

export default AccountNonFungibleTokensView;
