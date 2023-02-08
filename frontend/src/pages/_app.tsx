import "@explorer/frontend/libraries/wdyr";
import * as React from "react";

import { TRPCLink } from "@trpc/client";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import { splitLink } from "@trpc/client/links/splitLink";
import { wsLink, createWSClient } from "@trpc/client/links/wsLink";
import { withTRPC } from "@trpc/next";
import Gleap from "gleap";
import { i18n } from "i18next";
import { ExtraAppInitialProps, ServerAppInitialProps } from "next/app";
import { AppPropsType, AppType } from "next/dist/shared/lib/utils";
import Head from "next/head";
import { NextRouter, useRouter } from "next/router";
import { ReactQueryDevtools } from "react-query/devtools";

import type { AppRouter } from "@explorer/backend/router";
import { NetworkName } from "@explorer/common/types/common";
import { DeployInfo as DeployInfoProps } from "@explorer/common/types/procedures";
import { getEnvironment } from "@explorer/common/utils/environment";
import { getBranch, getShortCommitSha } from "@explorer/common/utils/git";
import { SSR_TIMEOUT } from "@explorer/common/utils/queries";
import { DeployInfo } from "@explorer/frontend/components/utils/DeployInfo";
import Footer from "@explorer/frontend/components/utils/Footer";
import Header from "@explorer/frontend/components/utils/Header";
import OfflineSplash from "@explorer/frontend/components/utils/OfflineSplash";
import { ToastController } from "@explorer/frontend/components/utils/ToastController";
import {
  LanguageContext,
  LanguageContextType,
} from "@explorer/frontend/context/LanguageContext";
import {
  NetworkContext,
  NetworkContextType,
} from "@explorer/frontend/context/NetworkContext";
import { useAnalyticsInit } from "@explorer/frontend/hooks/analytics/use-analytics-init";
import { useCookie } from "@explorer/frontend/hooks/use-cookie";
import { useDateLocale } from "@explorer/frontend/hooks/use-date-locale";
import { useI18n } from "@explorer/frontend/hooks/use-i18n";
import { useWatchBeta } from "@explorer/frontend/hooks/use-watch-beta";
import {
  getConfig,
  getNearNetworkName,
} from "@explorer/frontend/libraries/config";
import {
  CookieContext,
  getCookiesFromString,
} from "@explorer/frontend/libraries/cookie";
import { getDateLocale } from "@explorer/frontend/libraries/date-locale";
import {
  createI18n,
  Language,
  LANGUAGES,
} from "@explorer/frontend/libraries/i18n";
import {
  getLanguage,
  LANGUAGE_COOKIE,
} from "@explorer/frontend/libraries/language";
import { globalCss, styled } from "@explorer/frontend/libraries/styles";
import { MINUTE, YEAR } from "@explorer/frontend/libraries/time";
import { getBackendUrl } from "@explorer/frontend/libraries/transport";

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
  position: "relative",
  minHeight: "calc(100vh - 120px)",
});

const {
  publicRuntimeConfig: { nearNetworks, googleAnalytics, gleapKey },
} = getConfig();

if (typeof window !== "undefined" && gleapKey) {
  Gleap.initialize(gleapKey);
}

declare module "next/app" {
  // Props we need on SSR but don't want to pass via __NEXT_DATA__ to CSR
  type ServerAppInitialProps = {
    i18n: i18n;
    locale: LanguageContextType["locale"];
    cookies: string;
  };

  type ExtraAppInitialProps = {
    language: LanguageContextType["language"];
    networkName: NetworkName;
    deployInfo: DeployInfoProps;
    getServerProps?: () => ServerAppInitialProps;
  };

  interface AppInitialProps {
    pageProps: ExtraAppInitialProps;
  }
}

const wrapRouterHandlerMaintainNetwork =
  (
    router: NextRouter,
    originalHandler: NextRouter["replace"]
  ): NextRouter["replace"] =>
  (href, as, ...args) => {
    const { network } = router.query;
    return originalHandler(
      network ? `${href}?network=${network}` : href,
      network ? `${as}?network=${network}` : as,
      ...args
    );
  };

type ContextProps = {
  networkState: NetworkContextType;
  languageContext: LanguageContextType;
};

const AppContextWrapper: React.FC<ContextProps> = React.memo((props) => (
  <LanguageContext.Provider value={props.languageContext}>
    <NetworkContext.Provider value={props.networkState}>
      {props.children}
    </NetworkContext.Provider>
  </LanguageContext.Provider>
));

let extraAppInitialPropsCache: Omit<ExtraAppInitialProps, "getServerProps">;

const InnerApp: React.FC<AppPropsType> = React.memo(
  ({ Component, pageProps }) => {
    const {
      networkName,
      language: initialLanguage,
      deployInfo,
      getServerProps,
      ...restPageProps
    } = pageProps;
    extraAppInitialPropsCache = {
      language: initialLanguage,
      deployInfo,
      networkName,
    };
    const serverProps = getServerProps?.();

    const router = useRouter();
    React.useEffect(() => {
      router.replace = wrapRouterHandlerMaintainNetwork(router, router.replace);
      router.push = wrapRouterHandlerMaintainNetwork(router, router.push);
    }, [router]);

    const [language, setLanguage] = useCookie<Language>(LANGUAGE_COOKIE, {
      defaultValue: initialLanguage,
    });

    const locale = useDateLocale(serverProps?.locale, language);
    useI18n(serverProps?.i18n || (() => createI18n(language)), language);

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

    const languageContext = React.useMemo(
      () => ({ language, setLanguage, locale }),
      [language, setLanguage, locale]
    );

    useWatchBeta();

    return (
      <>
        <Head>
          <link
            rel="shortcut icon"
            type="image/png"
            href="/static/favicon.ico"
          />
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <AppContextWrapper
          networkState={networkState}
          languageContext={languageContext}
        >
          <AppWrapper>
            <Header />
            <ToastController />
            <BackgroundImage src="/static/images/explorer-bg.svg" />
            {offline ? <OfflineSplash /> : <Component {...restPageProps} />}
          </AppWrapper>
          <Footer />
          <DeployInfo client={deployInfo} />
          <ReactQueryDevtools />
        </AppContextWrapper>
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
  }
);

const App: AppType = ({ pageProps, ...props }) => {
  const [cookies] = React.useState(() =>
    getCookiesFromString(
      pageProps.getServerProps?.().cookies ?? document.cookie
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
    const language = getLanguage(
      LANGUAGES,
      req,
      req.headers["accept-language"]
    );
    let deployInfo: DeployInfoProps;
    if (process.env.RENDER) {
      deployInfo = {
        branch: process.env.RENDER_GIT_BRANCH || "unknown",
        commit: process.env.RENDER_GIT_COMMIT || "unknown",
        instanceId: process.env.RENDER_INSTANCE_ID || "unknown",
        serviceId: process.env.RENDER_SERVICE_ID || "unknown",
        serviceName: process.env.RENDER_SERVICE_NAME || "unknown",
        environment: getEnvironment(),
      };
    } else {
      const [branch, commit] = await Promise.all([
        getBranch(),
        getShortCommitSha(),
      ]);
      deployInfo = {
        branch,
        commit,
        instanceId: "local",
        serviceId: "local",
        serviceName: "frontend",
        environment: "dev" as const,
      };
    }
    const serverProps: ServerAppInitialProps = {
      i18n: createI18n(language),
      locale: await getDateLocale(language),
      cookies: req.headers.cookie ?? "",
    };
    initialProps = {
      deployInfo,
      networkName: getNearNetworkName(appContext.ctx.query, req.headers.host),
      language,
      getServerProps: () => serverProps,
    };
    appContext.ctx.res!.setHeader("set-cookie", [
      // We forgot to append a path to our cookie so now we may have
      // a bunch of different language cookies for each path.
      // So we're wiping them out and putting a proper one.
      `${LANGUAGE_COOKIE}=${language}; Max-Age=-1; Path=${appContext.ctx.pathname}`,
      `${LANGUAGE_COOKIE}=${language}; Max-Age=${YEAR / 1000}; Path=/`,
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

const getLinks = (
  endpointUrl: string,
  wsUrl: string
): TRPCLink<AppRouter>[] => {
  if (typeof window === "undefined") {
    return [
      httpBatchLink({
        url: endpointUrl,
      }),
    ];
  }
  return [
    splitLink({
      condition: (op) => op.type === "subscription",
      true: wsLink<AppRouter>({
        client: createWSClient({
          url: wsUrl,
        }),
      }),
      false: httpBatchLink({
        url: endpointUrl,
      }),
    }),
  ];
};

export default withTRPC<AppRouter>({
  config: (info) => {
    const networkName =
      "props" in info
        ? info.props.pageProps.networkName
        : getNearNetworkName(info.ctx.query ?? {}, info.ctx.req?.headers.host);
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
})(App);
