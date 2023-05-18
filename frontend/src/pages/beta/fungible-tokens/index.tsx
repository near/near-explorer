import * as React from "react";

import { NextPage } from "next";
import Head from "next/head";
import { Spinner } from "react-bootstrap";

import { FungibleTokenItem } from "@/common/types/procedures";
import { id } from "@/common/utils/utils";
import Content from "@/frontend/components/utils/Content";
import ErrorMessage from "@/frontend/components/utils/ErrorMessage";
import ListHandler from "@/frontend/components/utils/ListHandler";
import { TokenAmount } from "@/frontend/components/utils/TokenAmount";
import { styled } from "@/frontend/libraries/styles";
import { trpc } from "@/frontend/libraries/trpc";

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
          {tokensAmountQuery.status === "loading" ||
          tokensAmountQuery.status === "idle" ? (
            <Spinner animation="border" />
          ) : tokensAmountQuery.status === "error" ? (
            <ErrorMessage onRetry={tokensAmountQuery.refetch}>
              {tokensAmountQuery.error.message}
            </ErrorMessage>
          ) : (
            `Total of ${tokensAmountQuery.data} fungible tokens registered`
          )}
        </Header>
        <ListHandler<"fungibleTokens.list", FungibleTokenItem>
          query={fungibleTokensQuery}
          parser={id}
        >
          {(items) => {
            if (items.length === 0) {
              return <Spinner animation="border" />;
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
