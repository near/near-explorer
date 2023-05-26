import * as React from "react";

import Image from "next/legacy/image";
import { OverlayTrigger, Spinner, Tooltip } from "react-bootstrap";

import { AccountFungibleToken } from "@/common/types/procedures";
import { AccountFungibleTokenHistory } from "@/frontend/components/beta/accounts/AccountFungibleTokenHistory";
import { ErrorMessage } from "@/frontend/components/utils/ErrorMessage";
import { Link } from "@/frontend/components/utils/Link";
import { TokenAmount } from "@/frontend/components/utils/TokenAmount";
import {
  FungibleTokensAccountPageOptions,
  buildAccountUrl,
} from "@/frontend/hooks/use-account-page-options";
import { shortenString } from "@/frontend/libraries/formatting";
import { styled } from "@/frontend/libraries/styles";
import { trpc } from "@/frontend/libraries/trpc";

const Wrapper = styled("div", {
  display: "flex",
  alignItems: "flex-start",

  "@media (max-width: 768px)": {
    flexDirection: "column",
    alignItems: "stretch",
  },
});

const Tokens = styled("div", {
  flex: 1,
  display: "flex",
  flexDirection: "column",
});

const Token = styled(Link, {
  cursor: "pointer",
  display: "flex",
  justifyContent: "space-between",
  maxWidth: 345,
  border: "1px solid #ededed",
  borderRadius: 10,
  paddingHorizontal: 20,
  paddingVertical: 16,

  "&:hover": {
    border: "1px solid #1E93FF",
  },

  "@media (max-width: 768px)": {
    maxWidth: "initial",
  },

  variants: {
    selected: {
      true: {
        border: "1px solid #1E93FF",
      },
    },
  },

  "& + &": {
    marginTop: 12,
  },
});

const TokenHeader = styled("div", {
  display: "flex",
});

const TokenLogo = styled("div", {
  position: "relative",
  width: 30,
  height: 30,
});

const TokenEmptyLogo = styled("div", {
  width: "100%",
  height: "100%",
  background: "#ccc",
  borderRadius: "50%",
});

const TokenName = styled("div", {
  fontWeight: 700,
  fontSize: 18,
  lineHeight: "150%",
  marginLeft: 8,
});

const TokenAmountWrapper = styled("div", {
  fontWeight: 600,
  fontSize: 18,
  lineHeight: "150%",
  marginLeft: 24,
  textAlign: "right",
});

type ItemProps = {
  token: AccountFungibleToken;
  options: FungibleTokensAccountPageOptions;
  selected: boolean;
};

const AccountFungibleTokenView: React.FC<ItemProps> = React.memo(
  ({ token, options, selected }) => (
    <Token
      selected={selected}
      href={buildAccountUrl({ ...options, token: token.authorAccountId })}
    >
      <TokenHeader>
        <TokenLogo>
          {token.icon ? (
            <Image src={token.icon} layout="fill" />
          ) : (
            <TokenEmptyLogo />
          )}
        </TokenLogo>
        {shortenString(token.name).length === token.name.length ? (
          <TokenName>{token.name}</TokenName>
        ) : (
          <OverlayTrigger
            overlay={<Tooltip id="token-name">{token.name}</Tooltip>}
          >
            <TokenName>{shortenString(token.name)}</TokenName>
          </OverlayTrigger>
        )}
      </TokenHeader>
      <TokenAmountWrapper>
        <TokenAmount token={token} />
      </TokenAmountWrapper>
    </Token>
  )
);

type Props = {
  options: FungibleTokensAccountPageOptions;
};

export const AccountFungibleTokens: React.FC<Props> = React.memo(
  ({ options }) => {
    const tokensQuery = trpc.account.fungibleTokens.useQuery({
      accountId: options.accountId,
    });
    if (tokensQuery.status === "loading") {
      return (
        <Wrapper>
          <Spinner animation="border" />
        </Wrapper>
      );
    }
    if (tokensQuery.status === "error") {
      return (
        <Wrapper>
          <ErrorMessage onRetry={tokensQuery.refetch}>
            {tokensQuery.error.message}
          </ErrorMessage>
        </Wrapper>
      );
    }
    const tokens = tokensQuery.data;
    if (tokens.length === 0) {
      return <div>No fungible tokens yet!</div>;
    }
    const selectedToken = tokens.find(
      (token) => token.authorAccountId === options.token
    );
    return (
      <Wrapper>
        <Tokens>
          {tokens.map((token) => (
            <AccountFungibleTokenView
              key={token.authorAccountId}
              token={token}
              options={options}
              selected={token.authorAccountId === options.token}
            />
          ))}
        </Tokens>
        {selectedToken ? (
          <AccountFungibleTokenHistory
            accountId={options.accountId}
            token={selectedToken}
          />
        ) : null}
      </Wrapper>
    );
  }
);
