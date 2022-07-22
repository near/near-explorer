import * as React from "react";
import { NextPage } from "next";
import Head from "next/head";

import Content from "../../../components/utils/Content";
import { styled } from "../../../libraries/styles";
import ListHandler from "../../../components/utils/ListHandler";
import { trpc } from "../../../libraries/trpc";
import { id } from "../../../libraries/common";
import { FungibleTokenItem } from "../../../types/common";
import { TokenAmount } from "../../../components/utils/TokenAmount";

const Tokens = styled("div", {
  borderLeft: "1px solid black",
});

const Token = styled("div", {
  margin: 20,
  padding: 20,
  display: "flex",
});

const TokenElement = styled("div", {
  "& + &": {
    paddingTop: 12,
  },
});

const TokenImage = styled("img", {
  width: 48,
  height: 48,
  borderRadius: "50%",
  border: "3px solid black",
  marginRight: 20,
});

const Header = styled("h1", {
  fontSize: 26,
  whiteSpace: "pre-line",
});

const FUNGIBLE_TOKENS_PER_PAGE = 10;
const EMPTY_IMAGE =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII=";

const FungibleTokens: NextPage = React.memo(() => {
  const tokensAmountQuery = trpc.useQuery(["fungibleTokens.amount"]);
  const fungibleTokensQuery = trpc.useInfiniteQuery(
    ["fungibleTokens.list", { limit: FUNGIBLE_TOKENS_PER_PAGE }],
    {
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.length !== FUNGIBLE_TOKENS_PER_PAGE) {
          return;
        }
        return allPages.reduce((acc, page) => acc + page.length, 0);
      },
    }
  );

  return (
    <>
      <Head>
        <title>NEAR Explorer | Fungible tokens</title>
      </Head>
      <Content title={<h1>Fungible tokens</h1>}>
        <Header>
          {tokensAmountQuery.status === "success"
            ? `Total of ${tokensAmountQuery.data} fungible tokens registered`
            : "Loading FTs amount.."}
        </Header>
        <ListHandler<FungibleTokenItem> query={fungibleTokensQuery} parser={id}>
          {(items) => {
            if (items.length === 0) {
              return <div>Loading..</div>;
            }
            return (
              <Tokens>
                {items.map((token) => (
                  <Token key={token.authorAccountId}>
                    <TokenImage src={token.icon || EMPTY_IMAGE} />
                    <div>
                      <TokenElement>{token.name}</TokenElement>
                      <TokenElement>
                        Total supply:
                        <TokenAmount token={token} />
                      </TokenElement>
                    </div>
                  </Token>
                ))}
              </Tokens>
            );
          }}
        </ListHandler>
      </Content>
    </>
  );
});

export default FungibleTokens;
