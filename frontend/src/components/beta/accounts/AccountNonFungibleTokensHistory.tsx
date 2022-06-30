import * as React from "react";
import Image from "next/image";

import { styled } from "../../../libraries/styles";
import { trpc } from "../../../libraries/trpc";

import {
  AccountNonFungibleToken,
  AccountNonFungibleTokenHistoryElement,
} from "../../../types/common";
import Img from "../common/Img";
import AccountLink from "../../utils/AccountLink";
import ReceiptLink from "../../utils/ReceiptLink";

const Wrapper = styled("div", {
  width: 380,
  height: "80%",
  background: "#fff",
  position: "fixed",
  zIndex: 1,
  right: 0,
  bottom: 0,
  padding: 45,
  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.05)",
  borderTopLeftRadius: 12,
  borderTopRightRadius: 12,
});

const TitleWrapper = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});

const Title = styled("h4", {
  fontSize: 18,
  fontWeight: 700,
  lineHeight: "150%",
  marginBottom: 8,
});

const TokenLogo = styled("div", {
  position: "relative",
  width: 14,
  height: 14,
  marginRight: 6,
});
const TokenName = styled("div", {
  fontWeight: 600,
  fontSize: 12,
  lineHeight: "14px",

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
  marginBottom: 22,
});

const TokenImage = styled("div", {
  width: 266,
  height: 271,
  borderRadius: 12,
  marginBottom: 10,
  position: "relative",
  overflow: "hidden",
});

const Heading = styled(TokenName, {
  fontSize: 14,
  lineHeight: "17px",
  marginBottom: 10,
});

const Description = styled(Heading, {
  fontWeight: 400,
});

const CloseModal = styled("img", {
  cursor: "pointer",
});

const History = styled(Description, {
  display: "flex",
  flexWrap: "wrap",

  "& > *:not(:last-child)": {
    marginRight: 5,
  },
});

type ElementProps = {
  element: AccountNonFungibleTokenHistoryElement;
};
const AccountNonFungibleTokensHistoryElement: React.FC<ElementProps> =
  React.memo(({ element }) => {
    let eventType;
    if (element.eventKind === "MINT") {
      eventType = "minted by";
    } else if (element.eventKind === "TRANSFER") {
      eventType = "transferred to";
    } else if (element.eventKind === "BURN") {
      eventType = "burned";
    }
    return (
      <History>
        {element.prevAccountId ? (
          <AccountLink accountId={element.prevAccountId} />
        ) : null}
        <span>{eventType}</span>
        <AccountLink accountId={element.nextAccountId} />
        <span>at</span>
        <ReceiptLink
          transactionHash={element.transactionHash}
          receiptId={element.receiptId}
        />
      </History>
    );
  });

type Props = {
  token: AccountNonFungibleToken;
  onClick: React.ReactEventHandler;
};

const AccountNonFungibleTokensHistory: React.FC<Props> = React.memo(
  ({ token, onClick }) => {
    const tokenHistoryQuery = trpc.useQuery([
      "account-non-fungible-token-history",
      { tokenAuthorAccountId: token.authorAccountId, tokenId: token.tokenId },
    ]);
    const elements = tokenHistoryQuery.data ?? [];

    return (
      <Wrapper>
        <TitleWrapper>
          <Title>{token.metadata.title}</Title>
          <CloseModal
            onClick={onClick}
            src="/static/images/icon-modal-close.svg"
          />
        </TitleWrapper>
        <TokenInfo>
          <TokenLogo>
            {token.contractMetadata.icon ? (
              <Image src={token.contractMetadata.icon} layout="fill" />
            ) : null}
          </TokenLogo>
          <TokenName>{token.contractMetadata.name}</TokenName>
        </TokenInfo>
        <TokenImage>
          <Img src={token.metadata.media} />
        </TokenImage>
        <Description>{token.metadata.description}</Description>

        <Heading>Owner</Heading>
        <Description>{token.ownerId}</Description>

        <Heading>History</Heading>
        {tokenHistoryQuery.status === "loading" ? <div>loading....</div> : null}
        {elements.map((element) => (
          <AccountNonFungibleTokensHistoryElement
            key={`${element.receiptId}_${element.tokenId}`}
            element={element}
          />
        ))}
      </Wrapper>
    );
  }
);

export default AccountNonFungibleTokensHistory;
