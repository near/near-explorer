import * as React from "react";
import Image from "next/image";

import { styled } from "../../../libraries/styles";

import ListHandler from "../../utils/ListHandler";
import { trpc } from "../../../libraries/trpc";

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
  token: any;
};

const AccountFungibleTokenView: React.FC<ItemProps> = React.memo(({ token }) => {
  return (
    <Token>
      <TokenImage>
        <Image src={token.metadata.media} layout="fill" />
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
  );
});

type NonFungibleTokensAccountPageOptions = {
  accountId: string;
  tab: "collectibles";
  token?: string;
};

type Props = {
  options: NonFungibleTokensAccountPageOptions;
};

const AccountNonFungibleTokensView: React.FC<Props> = React.memo(({ options }) => {
  const query = trpc.useInfiniteQuery(
    ["account-non-fungible-tokens", {
      accountId: options.accountId,
      limit: TOKENS_PER_PAGE
    }],
    {
      getNextPageParam: (lastPage) => {
        const lastElement = lastPage[lastPage.length - 1];
        if (!lastElement) {
          return;
        }
        return lastElement.cursor;
      },
    }
  );

  return (
    <ListHandler query={query}>
      {(items) => {
        if (items.length === 0) {
          return <div>No collectibles yet!</div>;
        }
        return (
          <Wrapper>
            {items.map((token) => (
              <AccountFungibleTokenView key={token.token_id} token={token} />
            ))}
          </Wrapper>
        );
      }}
    </ListHandler>
  );
});

export default AccountNonFungibleTokensView;
