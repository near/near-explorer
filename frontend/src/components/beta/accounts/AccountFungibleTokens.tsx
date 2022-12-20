import * as React from "react";
import Image from "next/image";

import { styled } from "../../../libraries/styles";
import { AccountFungibleToken } from "../../../types/common";
import { trpc } from "../../../libraries/trpc";
import {
  FungibleTokensAccountPageOptions,
  buildAccountUrl,
} from "../../../hooks/use-account-page-options";
import LinkWrapper from "../../utils/Link";
import AccountFungibleTokenHistory from "./AccountFungibleTokenHistory";
import { TokenAmount } from "../../utils/TokenAmount";
import { shortenString } from "../../../libraries/formatting";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

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

const TokenLink = styled(LinkWrapper, {
  "& + &": {
    marginTop: 12,
  },
});

const Token = styled("div", {
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
  ({ token, options, selected }) => {
    return (
      <TokenLink
        href={buildAccountUrl({ ...options, token: token.authorAccountId })}
        shallow
      >
        <Token selected={selected}>
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
      </TokenLink>
    );
  }
);

type Props = {
  options: FungibleTokensAccountPageOptions;
};

const AccountFungibleTokensView: React.FC<Props> = React.memo(({ options }) => {
  const tokensQuery = trpc.useQuery([
    "account.fungibleTokens",
    { accountId: options.accountId },
  ]);
  const tokens = tokensQuery.data || [];
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
});

export default AccountFungibleTokensView;
