import * as React from "react";

import Image from "next/image";
import { Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import {
  AccountNonFungibleTokenElement,
  AccountNonFungibleTokenHistoryElement,
} from "@explorer/common/types/procedures";
import NFTMedia from "@explorer/frontend/components/beta/common/NFTMedia";
import AccountLink from "@explorer/frontend/components/utils/AccountLink";
import ReceiptLink from "@explorer/frontend/components/utils/ReceiptLink";
import { useFormatDistance } from "@explorer/frontend/hooks/use-format-distance";
import { styled } from "@explorer/frontend/libraries/styles";
import { trpc } from "@explorer/frontend/libraries/trpc";

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
    const formatDuration = useFormatDistance();

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
        <span>{formatDuration(element.timestamp)}</span>
      </History>
    );
  });

type Props = {
  token: AccountNonFungibleTokenElement;
  onClick: React.ReactEventHandler;
};

const AccountNonFungibleTokensHistory: React.FC<Props> = React.memo(
  ({ token, onClick }) => {
    const { t } = useTranslation();
    const tokenHistoryQuery = trpc.useQuery([
      "account.nonFungibleTokenHistory",
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
          <NFTMedia src={token.metadata.media} />
        </TokenImage>
        {token.metadata.description ? (
          <>
            <Heading>Description</Heading>
            <Description>{token.metadata.description}</Description>
          </>
        ) : null}

        <Heading>Owner</Heading>
        <Description>{token.ownerId}</Description>

        <Heading>History</Heading>
        {tokenHistoryQuery.status === "loading" ? (
          <Spinner animation="border" />
        ) : null}
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
