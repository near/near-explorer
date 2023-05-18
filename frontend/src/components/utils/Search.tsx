import * as React from "react";

import Image from "next/legacy/image";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { Button, FormControl, InputGroup, Row, Spinner } from "react-bootstrap";

import { TRPCMutationOutput } from "@/common/types/trpc";
import ErrorMessage from "@/frontend/components/utils/ErrorMessage";
import { useAnalyticsTrack } from "@/frontend/hooks/analytics/use-analytics-track";
import { useQueryParam } from "@/frontend/hooks/use-query-param";
import { styled } from "@/frontend/libraries/styles";
import { trpc } from "@/frontend/libraries/trpc";

const LoadingIcon = styled("div", {
  background: "#ffffff",
  borderWidth: 2,
  borderColor: "#eaebeb",
  borderStyle: "solid",
  borderRightWidth: 0,
  borderLeftWidth: 0,
  display: "flex",
  alignItems: "center",
  paddingHorizontal: 16,
  transition: "border-color 0.15s ease-in-out",

  variants: {
    compact: {
      true: {
        backgroundColor: "#fafafa",
      },
    },
  },
});

const SearchField = styled(FormControl, {
  background: "#ffffff",
  borderLeft: "inherit",
  border: "2px solid #eaebeb",
  borderRight: "none",
  borderRadius: "8px 0 0 8px",
  boxShadow: "none !important",
  paddingRight: "0.313rem",
  height: "100% !important",

  "&:focus-within": {
    boxShadow: "none",
  },

  "&::placeholder": {
    color: "#8d9396",
  },

  "&:disabled": {
    background: "#eaebeb",
  },

  variants: {
    compact: {
      true: {
        backgroundColor: "#fafafa",
        borderLeft: "none",
        borderRight: "2px solid #eaebeb",
        borderRadius: "0 8px 8px 0",
        paddingLeft: 0,
      },
    },
    loading: {
      true: {
        borderRightWidth: 0,
      },
    },
  },
});

const InputGroupText = styled(InputGroup.Text, {
  background: "#fafafa",
  height: "100%",

  "&::placeholder": {
    color: "#a1a1a9",
  },
});

const ButtonSearch = styled(Button, {
  position: "relative",
  background: "#0072ce",
  border: "2px solid #0072ce",
  borderRadius: "0px 8px 8px 0px",
  padding: "10px 30px",

  "&:hover": {
    background: "#2b9af4",
    borderColor: "#0072ce",
  },

  "&:not(:disabled):active, &:not(:disabled):active:focus, &:not(:disabled):focus":
    {
      backgroundColor: "#2b9af4",
      borderColor: "#0072ce",
      boxShadow: "none",
    },
});

const InputGroupWrapper = styled(InputGroup, {
  borderRadius: 8,

  "&:focus-within": {
    boxShadow: "0px 0px 0px 4px #c2e4ff",
    borderRadius: 10,
    background: "white",
  },

  [`&:focus-within ${SearchField}, &:focus-within .input-group-prepend ${InputGroupText}, &:focus-within .input-group-append ${LoadingIcon}`]:
    {
      borderColor: "#0072ce !important",
      backgroundColor: "white",
    },

  "&:hover": {
    background: "#f8f9fb",
    borderRadius: 8,
  },

  [`&:hover ${SearchField}, &:hover .input-group-prepend ${InputGroupText}, &:hover .input-group-append ${LoadingIcon}`]:
    {
      borderColor: "#cdcfd1",
    },

  [`& ${ButtonSearch}::before`]: {
    content: "",
    position: "absolute",
    top: 0,
    left: "-1.25rem",
    bottom: 0,
    display: "block",
    width: "1rem",
    height: "calc(100% - 8px)",
    margin: "auto 4px auto auto",
    filter: "blur(2px)",
    background: "white",
    opacity: 0.9,
  },
});

const SearchWrapper = styled("form", {
  background: "white",
  width: 740,
  maxWidth: "100%",
  height: 49,
  margin: "auto",
  borderRadius: 8,

  variants: {
    compact: {
      true: {
        width: 520,
        height: 40,

        "@media (max-width: 1000px)": {
          width: "100%",
        },

        [`& .input-group-prepend ${InputGroupText}`]: {
          border: "2px solid #eaebeb",
          borderRadius: "8px 0 0 8px",
          borderRight: "none",
          transition:
            "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
        },

        [`& .input-group-append ${LoadingIcon}`]: {
          borderLeft: "none",
          borderRightWidth: 2,
          borderTopRightRadius: 8,
          borderBottomRightRadius: 8,
          transition:
            "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
        },

        [`& ${InputGroupWrapper}::after`]: {
          content: "",
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          display: "block",
          width: "1rem",
          height: "calc(100% - 8px)",
          margin: "auto 4px auto auto",
          filter: "blur(2px)",
          background: "#fafafa",
          opacity: 0.9,
        },

        [`${InputGroupWrapper}:focus-within::after`]: {
          background: "white",
        },
      },
    },
  },

  "@media (max-width: 1000px)": {
    width: "100%",
  },
});

const SearchBox = styled(Row, {
  width: "inherit",
  height: "inherit",
  borderRadius: "inherit",
});

export const getRedirectPage = (
  result: TRPCMutationOutput<"utils.search">
): string | undefined => {
  if (!result) {
    return undefined;
  }
  if ("blockHash" in result) {
    return `/blocks/${result.blockHash}`;
  }
  if ("receiptId" in result) {
    return `/transactions/${result.transactionHash}#${result.receiptId}`;
  }
  if ("transactionHash" in result) {
    return `/transactions/${result.transactionHash}`;
  }
  if ("accountId" in result) {
    return `/accounts/${result.accountId}`;
  }
  return undefined;
};

interface Props {
  dashboard?: boolean;
}

const Search: React.FC<Props> = React.memo(({ dashboard }) => {
  const router = useRouter();

  const { t } = useTranslation();
  const track = useAnalyticsTrack();

  const [queryValue, setQueryValue] = useQueryParam("query");
  const [inputValue, setInputValue] = React.useState<string>(queryValue || "");

  React.useEffect(() => {
    setQueryValue(inputValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  const searchMutation = trpc.useMutation("utils.search", {
    onSuccess: (result) => {
      const page = getRedirectPage(result);
      if (!page) {
        // TODO: add popup with error instead of alert
        // eslint-disable-next-line no-alert
        return alert("Result not found!");
      }
      track("Explorer Search", { page: result });
      router.push(page);
    },
  });
  const onSubmit = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (searchMutation.status === "loading") {
        return;
      }
      searchMutation.mutate({ value: queryValue?.replace(/\s/g, "") ?? "" });
    },
    [queryValue, searchMutation]
  );

  const onChange = React.useCallback<React.MouseEventHandler<HTMLInputElement>>(
    (event) => setInputValue(event.currentTarget.value),
    []
  );

  const compact = !dashboard;

  return (
    <>
      <SearchWrapper onSubmit={onSubmit} compact={compact}>
        <SearchBox noGutters>
          <InputGroupWrapper>
            {!dashboard && (
              <InputGroup.Prepend>
                <InputGroupText id="search">
                  <Image
                    src="/static/images/icon-search.svg"
                    alt={t("component.utils.Search.title")!}
                    width={14}
                    height={14}
                  />
                </InputGroupText>
              </InputGroup.Prepend>
            )}

            <SearchField
              placeholder={t("component.utils.Search.hint")}
              aria-label="Search"
              aria-describedby="search"
              autoCorrect="off"
              autoCapitalize="none"
              onChange={onChange}
              compact={compact}
              loading={searchMutation.isLoading}
              value={inputValue}
            />

            {searchMutation.isLoading ? (
              <InputGroup.Append>
                <LoadingIcon compact={compact}>
                  <Spinner animation="border" />
                </LoadingIcon>
              </InputGroup.Append>
            ) : null}
            {dashboard && (
              <ButtonSearch
                type="submit"
                variant="info"
                disabled={searchMutation.status === "loading"}
              >
                {t("component.utils.Search.title")}
              </ButtonSearch>
            )}
          </InputGroupWrapper>
        </SearchBox>
      </SearchWrapper>
      {searchMutation.status === "error" ? (
        <ErrorMessage onRetry={searchMutation.reset}>
          {searchMutation.error.message}
        </ErrorMessage>
      ) : null}
    </>
  );
});

export default Search;
