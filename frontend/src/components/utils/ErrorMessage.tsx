import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "../../libraries/styles";

type Props = {
  header?: string;
  children: string;
  onRetry?: () => void;
  retryText?: string;
};

const Wrapper = styled("div", {
  padding: 32,
  overflow: "hidden",
});
const Header = styled("div", {
  fontWeight: 700,
  fontSize: 24,
  lineHeight: "32px",
});
const HeaderTitle = styled("span", {
  color: "#FF4B55",
});
const Message = styled("div", {
  marginTop: 16,
  color: "#9B9B9B",
});
const RetryButton = styled("button", {
  marginTop: 16,
  background: "#1E93FF",
  borderRadius: 4,
  paddingVertical: 12,
  paddingHorizontal: 16,
  border: "none",
  color: "#fff",
});

const ErrorMessage = React.memo<Props>(
  ({ header, children, onRetry, retryText }) => {
    const { t } = useTranslation();
    return (
      <Wrapper>
        <Header>
          <HeaderTitle>{t("common.error")}</HeaderTitle>
          {header ? `: ${header}` : null}
        </Header>
        <Message>{children}</Message>
        {onRetry ? (
          <RetryButton onClick={onRetry}>
            {retryText || t("common.retry")}
          </RetryButton>
        ) : null}
      </Wrapper>
    );
  }
);

export default ErrorMessage;
