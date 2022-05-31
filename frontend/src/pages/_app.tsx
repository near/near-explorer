import "../libraries/wdyr";
import { ExtraAppInitialProps } from "next/app";
import { withTRPC } from "@trpc/next";
import { wsLink, createWSClient } from "@trpc/client/links/wsLink";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import { splitLink } from "@trpc/client/links/splitLink";
import { TRPCLink } from "@trpc/client";
import Head from "next/head";
import { NextRouter, useRouter } from "next/router";
import * as React from "react";
import { ReactQueryDevtools } from "react-query/devtools";
import { exec } from "child_process";
import { promisify } from "util";

import { getConfig, getNearNetworkName } from "../libraries/config";
import { AppRouter, NetworkName } from "../types/common";

import Header from "../components/utils/Header";
import Footer from "../components/utils/Footer";
import { NetworkContext } from "../context/NetworkContext";
import { DeployInfo } from "../components/utils/DeployInfo";
import { DeployInfo as DeployInfoProps } from "../types/common";

import {
  getLanguage,
  LANGUAGE_COOKIE,
  setMomentLanguage,
} from "../libraries/language";
import { useAnalyticsInit } from "../hooks/analytics/use-analytics-init";
import { initializeI18n, Language, LANGUAGES } from "../libraries/i18n";
import { AppType } from "next/dist/shared/lib/utils";
import { setI18n } from "react-i18next";
import { MINUTE, YEAR } from "../libraries/time";
import { globalCss, styled } from "../libraries/styles";
import { getBackendUrl } from "../libraries/transport";

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
  publicRuntimeConfig: { nearNetworks, googleAnalytics },
} = getConfig();

declare module "next/app" {
  type ExtraAppInitialProps = {
    language: Language;
    networkName: NetworkName;
    deployInfo: DeployInfoProps;
  };

  interface AppInitialProps {
    pageProps: ExtraAppInitialProps;
  }
}

const wrapRouterHandlerMaintainNetwork = (
  router: NextRouter,
  originalHandler: NextRouter["replace"]
): NextRouter["replace"] => {
  return (href, as, ...args) => {
    const network = router.query.network;
    if (network) {
      href += `?network=${network}`;
      as += `?network=${network}`;
    }
    return originalHandler(href, as, ...args);
  };
};

type ContextProps = {
  networkState: NetworkContext;
};

const AppContextWrapper: React.FC<ContextProps> = React.memo((props) => {
  return (
    <NetworkContext.Provider value={props.networkState}>
      {props.children}
    </NetworkContext.Provider>
  );
});

let extraAppInitialPropsCache: ExtraAppInitialProps;

const App: AppType = React.memo(({ Component, pageProps }) => {
  const { networkName, language, deployInfo, ...restPageProps } = pageProps;
  extraAppInitialPropsCache = {
    language,
    deployInfo,
    networkName,
  };
  const router = useRouter();
  React.useEffect(() => {
    router.replace = wrapRouterHandlerMaintainNetwork(router, router.replace);
    router.push = wrapRouterHandlerMaintainNetwork(router, router.push);
  }, [router]);

  if (typeof window !== "undefined" && language) {
    setMomentLanguage(language);
    // There is no react way of waiting till i18n is initialized before render
    // But at the moment SSR should render content properly
    void initializeI18n(language);
  }
  useAnalyticsInit();
  globalStyles();

  const networkState = React.useMemo(
    () => ({
      networkName,
      networks: nearNetworks,
    }),
    [networkName, nearNetworks]
  );

  return (
    <>
      <Head>
        <link rel="shortcut icon" type="image/png" href="/static/favicon.ico" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <AppContextWrapper networkState={networkState}>
        <AppWrapper>
          <Header />
          <BackgroundImage src="/static/images/explorer-bg.svg" />
          <Component {...restPageProps} />
        </AppWrapper>
        <Footer />
        <DeployInfo client={deployInfo} />
        <ReactQueryDevtools />
      </AppContextWrapper>
      {googleAnalytics ? (
        <>
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

App.getInitialProps = async (appContext) => {
  const req = appContext.ctx.req;
  let initialProps: ExtraAppInitialProps;
  if (req) {
    // Being server-side can be detected with 'req' existence
    const language = getLanguage(
      LANGUAGES,
      req.headers.cookie,
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
      };
    } else {
      const promisifiedExec = promisify(exec);
      const [{ stdout: branch }, { stdout: commit }] = await Promise.all([
        promisifiedExec("git branch --show-current"),
        promisifiedExec("git rev-parse --short HEAD"),
      ]);
      deployInfo = {
        branch: branch.trim(),
        commit: commit.trim(),
        instanceId: "local",
        serviceId: "local",
        serviceName: "frontend",
      };
    }
    initialProps = {
      deployInfo,
      networkName: getNearNetworkName(appContext.ctx.query, req.headers.host),
      language,
    };
    setI18n(await initializeI18n(language));
    setMomentLanguage(language);
    appContext.ctx.res!.setHeader(
      "set-cookie",
      `${LANGUAGE_COOKIE}=${language}; Max-Age=${YEAR / 1000}`
    );
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
    const httpUrl = getBackendUrl(networkName, "http");
    const wsUrl = getBackendUrl(networkName, "websocket");
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
      ssrTimeout: 3000,
    };
  },
  ssr: true,
})(App);
