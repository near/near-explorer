import "@/frontend/libraries/wdyr";
import * as React from "react";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { withTRPC } from "@trpc/next";
import Gleap from "gleap";
import { NextPage } from "next";
import { AppProps } from "next/app";
import {
  AppPropsType,
  AppType,
  NextPageContext,
} from "next/dist/shared/lib/utils";
import Head from "next/head";
import { NextRouter, useRouter } from "next/router";
import { appWithTranslation, SSRConfig } from "next-i18next";

import type { AppRouter } from "@/backend/router";
import { NetworkName } from "@/common/types/common";
import { DeployInfo as DeployInfoProps } from "@/common/types/procedures";
import { getEnvironmentVariables } from "@/common/utils/environment";
import { SSR_TIMEOUT } from "@/common/utils/queries";
import { id } from "@/common/utils/utils";
import { DeployInfo } from "@/frontend/components/utils/DeployInfo";
import Footer from "@/frontend/components/utils/Footer";
import Header from "@/frontend/components/utils/Header";
import OfflineSplash from "@/frontend/components/utils/OfflineSplash";
import { ToastController } from "@/frontend/components/utils/ToastController";
import {
  NetworkContext,
  NetworkContextType,
} from "@/frontend/context/NetworkContext";
import { SSRContext, SSRContextType } from "@/frontend/context/SSRContext";
import { useAnalyticsInit } from "@/frontend/hooks/analytics/use-analytics-init";
import { useCookie } from "@/frontend/hooks/use-cookie";
import { useLanguage } from "@/frontend/hooks/use-language";
import { useWatchBeta } from "@/frontend/hooks/use-watch-beta";
import { getConfig, getNearNetworkName } from "@/frontend/libraries/config";
import {
  CookieContext,
  getClientCookiesSafe,
  getCookiesFromString,
} from "@/frontend/libraries/cookie";
import {
  fetchDateLocale,
  getCachedDateLocale,
  setCachedDateLocale,
} from "@/frontend/libraries/date-locale";
import {
  DEFAULT_LANGUAGE,
  getSsrProps,
  i18nUserConfig,
  Language,
  LANGUAGES,
} from "@/frontend/libraries/i18n";
import {
  getServerLanguage,
  LANGUAGE_COOKIE,
} from "@/frontend/libraries/language";
import { globalCss, styled } from "@/frontend/libraries/styles";
import { MINUTE, YEAR } from "@/frontend/libraries/time";
import { getBackendUrl } from "@/frontend/libraries/transport";
import { getLinks } from "@/frontend/libraries/trpc";

const globalStyles = globalCss({
  body: {
    backgroundColor: "#f9f9f9",
    height: "100%",
    margin: 0,
    fontFamily: `"Inter", sans-serif`,
  },
  a: {
    textDecoration: "none",
    "&:hover": {
      textDecoration: "none",
    },
  },
  h1: {
    fontWeight: 900,
    wordWrap: "break-word",
    color: "#24272a",
    fontSize: 32,
    "@media (min-width: 1600px)": {
      fontSize: 48,
    },
    "@media (max-width: 300px)": {
      fontSize: 28,
    },
  },
  h2: {
    fontSize: 24,
  },
  pre: {
    whiteSpace: "pre-wrap",
  },
});

const BackgroundImage = styled("img", {
  position: "absolute",
  right: 0,
  top: 72,
  zIndex: -1,
});

const AppWrapper = styled("div", {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
});

const {
  publicRuntimeConfig: { nearNetworks, googleAnalytics, gleapKey },
} = getConfig();

if (typeof window !== "undefined" && gleapKey) {
  Gleap.initialize(gleapKey);
}

// Props we need on SSR but don't want to pass via __NEXT_DATA__ to CSR
type ServerAppInitialProps = {
  cookies: string;
};

type ExtraAppInitialProps = {
  language: Language;
  networkName: NetworkName;
  deployInfo: DeployInfoProps;
  getServerProps?: () => ServerAppInitialProps;
} & SSRConfig &
  Omit<SSRContextType, "isFirstRender">;

interface AppInitialProps {
  pageProps: ExtraAppInitialProps;
}

const wrapRouterHandlerMaintainNetwork =
  (
    router: NextRouter,
    originalHandler: NextRouter["replace"]
  ): NextRouter["replace"] =>
  (href, as, ...args) => {
    const { network, language } = router.query;
    const params = Object.entries({ network, language })
      .map(([key, value]) => (value ? `${key}=${value}` : ""))
      .filter(Boolean)
      .join(`&`);
    const tail = `${params.length === 0 ? "" : "?"}${params}`;
    return originalHandler(
      typeof href === "string" ? `${href}${tail}` : href,
      typeof as === "string" ? `${as}${tail}` : as,
      ...args
    );
  };

type GetLayout = (page: React.ReactElement) => React.ReactNode;
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: GetLayout;
};

const defaultGetLayout: GetLayout = (children) => (
  <AppWrapper>
    <Header />
    <ToastController />
    <BackgroundImage src="/static/images/explorer-bg.svg" />
    {children}
    <Footer />
  </AppWrapper>
);

const SSRContextWrapper: React.FC<
  React.PropsWithChildren<Omit<SSRContextType, "isFirstRender">>
> = React.memo(({ children, nowTimestamp, tzOffset }) => {
  const [isMounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return (
    <SSRContext.Provider
      value={React.useMemo(
        () => ({ isFirstRender: !isMounted, nowTimestamp, tzOffset }),
        [nowTimestamp, tzOffset, isMounted]
      )}
    >
      {children}
    </SSRContext.Provider>
  );
});

const NetworkWrapper: React.FC<
  React.PropsWithChildren<{
    networkState: NetworkContextType;
  }>
> = React.memo((props) => (
  <NetworkContext.Provider value={props.networkState}>
    {props.children}
  </NetworkContext.Provider>
));

let extraAppInitialPropsCache: Omit<ExtraAppInitialProps, "getServerProps">;

const InnerApp: React.FC<
  AppPropsType<NextRouter, ExtraAppInitialProps> & {
    Component: NextPageWithLayout;
  }
> = React.memo(({ Component, pageProps }) => {
  const {
    networkName,
    language: initialLanguage,
    nowTimestamp,
    tzOffset,
    deployInfo,
    getServerProps,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    _nextI18Next,
    ...restPageProps
  } = pageProps;
  extraAppInitialPropsCache = {
    language: initialLanguage,
    nowTimestamp,
    tzOffset,
    deployInfo,
    networkName,
    _nextI18Next,
  };

  const router = useRouter();
  React.useEffect(() => {
    router.replace = wrapRouterHandlerMaintainNetwork(router, router.replace);
    router.push = wrapRouterHandlerMaintainNetwork(router, router.push);
  }, [router]);

  const [language, , isQuery] = useLanguage();
  const [, setLanguageCookie] = useCookie<Language>(LANGUAGE_COOKIE, {
    defaultValue: language,
  });
  React.useEffect(() => {
    if (!isQuery) {
      setLanguageCookie(language);
    }
  }, [setLanguageCookie, language, isQuery]);
  React.useEffect(() => {
    Gleap.setLanguage(language);
  }, [language]);

  useAnalyticsInit();
  globalStyles();

  const networkState = React.useMemo(
    () => ({
      networkName,
      networks: nearNetworks,
    }),
    [networkName]
  );
  const currentNetwork = nearNetworks[networkName];
  const offline = Boolean(currentNetwork?.offline);

  useWatchBeta();

  const getLayout = router.query.embedded
    ? id
    : Component.getLayout || defaultGetLayout;

  return (
    <>
      <Head>
        <link rel="shortcut icon" type="image/png" href="/static/favicon.ico" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <SSRContextWrapper nowTimestamp={nowTimestamp} tzOffset={tzOffset}>
        <NetworkWrapper networkState={networkState}>
          {getLayout(
            offline ? <OfflineSplash /> : <Component {...restPageProps} />
          )}
          <DeployInfo client={deployInfo} />
          <ReactQueryDevtools />
        </NetworkWrapper>
      </SSRContextWrapper>
      {googleAnalytics ? (
        /* eslint-disable react/no-danger */ <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalytics}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', '${googleAnalytics}');
              `,
            }}
          />
        </>
      ) : null}
    </>
  );
});

const App: AppType<{ pageProps: ExtraAppInitialProps }> = ({
  pageProps: rawPageProps,
  ...props
}) => {
  // Remove when https://github.com/vercel/next.js/pull/44434 resolved
  const pageProps = rawPageProps as unknown as ExtraAppInitialProps;
  const [cookies] = React.useState(() =>
    getCookiesFromString(
      pageProps.getServerProps?.().cookies ?? getClientCookiesSafe()
    )
  );
  return (
    <CookieContext.Provider value={cookies}>
      <InnerApp pageProps={pageProps} {...props} />
    </CookieContext.Provider>
  );
};

App.getInitialProps = async (appContext) => {
  const { req } = appContext.ctx;
  let initialProps: ExtraAppInitialProps;
  if (req) {
    // Being server-side can be detected with 'req' existence
    const { query: queryLanguage, default: defaultLanguage } =
      getServerLanguage(LANGUAGES, DEFAULT_LANGUAGE, req, appContext.ctx.query);
    const language = queryLanguage || defaultLanguage;
    const deployInfo = await getEnvironmentVariables("frontend");
    const serverProps: ServerAppInitialProps = {
      cookies: req.headers.cookie ?? "",
    };
    if (!getCachedDateLocale(language)) {
      setCachedDateLocale(language, await fetchDateLocale(language));
    }
    initialProps = {
      deployInfo,
      nowTimestamp: Date.now(),
      tzOffset: new Date().getTimezoneOffset(),
      networkName: getNearNetworkName(appContext.ctx.query, req.headers.host),
      language,
      getServerProps: () => serverProps,
      ...(await getSsrProps(language)),
    };
    appContext.ctx.res!.setHeader("set-cookie", [
      // We forgot to append a path to our cookie so now we may have
      // a bunch of different language cookies for each path.
      // So we're wiping them out and putting a proper one.
      `${LANGUAGE_COOKIE}=${defaultLanguage}; Max-Age=-1; Path=${appContext.ctx.pathname}`,
      `${LANGUAGE_COOKIE}=${defaultLanguage}; Max-Age=${YEAR / 1000}; Path=/`,
    ]);
  } else {
    // This branch is called only on page change hence we don't need to calculate language at the moment
    // as i18next is already configured
    initialProps = extraAppInitialPropsCache;
  }

  return {
    pageProps: initialProps,
  };
};

export default withTRPC<AppRouter, NextPageContext, ExtraAppInitialProps>({
  config: (info) => {
    let networkName =
      "props" in info
        ? info.props.pageProps.networkName
        : getNearNetworkName(info.ctx.query ?? {}, info.ctx.req?.headers.host);
    if (!networkName) {
      // eslint-disable-next-line no-console
      console.warn("No network name found, using default (mainnet)");
      networkName = getNearNetworkName({});
    }
    const isSsr = typeof window === "undefined";
    const httpUrl = getBackendUrl(networkName, "http", isSsr);
    const wsUrl = getBackendUrl(networkName, "websocket", isSsr);
    return {
      queryClientConfig: {
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: false,
            staleTime: MINUTE,
          },
        },
      },
      links: getLinks(httpUrl, wsUrl),
      ssrTimeout: SSR_TIMEOUT,
    };
  },
  ssr: true,
})(
  appWithTranslation(
    App as React.ComponentType<AppProps & AppInitialProps>,
    i18nUserConfig
  )
);
