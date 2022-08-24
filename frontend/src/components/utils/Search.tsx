import Router from "next/router";
import * as React from "react";
import { Button, FormControl, InputGroup, Row } from "react-bootstrap";

import { useTranslation } from "react-i18next";
import { useAnalyticsTrack } from "../../hooks/analytics/use-analytics-track";
import { trpc } from "../../libraries/trpc";
import { styled } from "../../libraries/styles";

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

  [`&:focus-within ${SearchField}, &:focus-within .input-group-prepend ${InputGroupText}`]:
    {
      borderColor: "#0072ce !important",
      backgroundColor: "white",
    },

  "&:hover": {
    background: "#f8f9fb",
    borderRadius: 8,
  },

  [`&:hover ${SearchField}, &:hover .input-group-prepend ${InputGroupText}`]: {
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

interface Props {
  dashboard?: boolean;
  query?: string;
}

const redirectToAppropriatePage: (
  query: string,
  trpcContext: any,
  track: any
) => Promise<boolean | undefined> = async (query, trpcContext, track) => {
  // TODO: Specify the types for `trpcContext` and `track`.
  const cleanedSearchValue = query.replace(/\s/g, "");

  const blockPromise = trpcContext
    .fetchQuery(["block.getHashById", { blockId: cleanedSearchValue }])
    .catch(() => null);
  const transactionByHashPromise = trpcContext
    .fetchQuery(["transaction.byHash", { hash: cleanedSearchValue }])
    .catch(() => undefined);
  const accountPromise = trpcContext.fetchQuery([
    "account.byIdOld",
    { id: cleanedSearchValue.toLowerCase() },
  ]);
  const transactionByReceiptIdPromise = trpcContext
    .fetchQuery(["transaction.byReceiptId", { receiptId: cleanedSearchValue }])
    .catch(() => undefined);

  const block = await blockPromise;
  if (block) {
    track("Explorer Search for block", { block: block });
    return Router.push("/blocks/" + block);
  }
  const transaction = await transactionByHashPromise;
  if (transaction) {
    track("Explorer Search for transaction", {
      transaction: query,
    });
    return Router.push("/transactions/" + transaction.hash);
  }
  if (await accountPromise) {
    track("Explorer Search for account", { account: query });
    return Router.push("/accounts/" + query.toLowerCase());
  }
  const receipt = await transactionByReceiptIdPromise;
  if (receipt) {
    return Router.push(
      `/transactions/${receipt.transactionHash}#${receipt.receiptId}`
    );
  }
  track("Explorer Search result not found", {
    detail: query,
  });
  alert("Result not found!");
};

const Search: React.FC<Props> = React.memo(({ dashboard, query }) => {
  const { t } = useTranslation();
  const track = useAnalyticsTrack();

  const [value, setValue] = React.useState("");
  const trpcContext = trpc.useContext();
  const onSubmit = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      redirectToAppropriatePage(value, trpcContext, track);
    },
    [value, trpcContext.fetchQuery]
  );
  const onChange = React.useCallback(
    (event) => setValue(event.currentTarget.value),
    [setValue]
  );

  const compact = !dashboard;

  React.useEffect(() => {
    // On page load, fetch any query from the 'q' query string parameter, and if it exists, call `redirectToAppropriatePage`.
    // This feature enables helpful tools such as Chrome Custom Search Engines.

    if (query) {
      setValue(query);
      redirectToAppropriatePage(query, trpcContext, track);
    }
  }, [track]);

  return (
    <SearchWrapper onSubmit={onSubmit} compact={compact}>
      <SearchBox noGutters>
        <InputGroupWrapper>
          {!dashboard && (
            <InputGroup.Prepend>
              <InputGroupText id="search">
                <img src="/static/images/icon-search.svg" />
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
            defaultValue={value}
          />

          {dashboard && (
            <ButtonSearch type="submit" variant="info">
              {t("component.utils.Search.title")}
            </ButtonSearch>
          )}
        </InputGroupWrapper>
      </SearchBox>
    </SearchWrapper>
  );
});

export default Search;
