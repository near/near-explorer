import "../libraries/wdyr";
import NextApp, { AppContext, AppInitialProps } from "next/app";
import Head from "next/head";
import { NextRouter, useRouter } from "next/router";
import * as React from "react";

import { getConfig, getNearNetwork, NearNetwork } from "../libraries/config";

import Header from "../components/utils/Header";
import Footer from "../components/utils/Footer";
import { NetworkContext } from "../context/NetworkContext";

import {
  getLanguage,
  LANGUAGE_COOKIE,
  setMomentLanguage,
} from "../libraries/language";
import { useAnalyticsInit } from "../hooks/analytics/use-analytics-init";
import { initializeI18n, Language, LANGUAGES } from "../libraries/i18n";
import { AppType } from "next/dist/shared/lib/utils";
import { setI18n } from "react-i18next";
import { YEAR } from "../libraries/time";
import { globalCss, styled } from "../libraries/styles";

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
  interface AppInitialProps {
    pageProps: any;
    language?: Language;
    currentNearNetwork: NearNetwork;
  }
}

const wrapHandler = <T extends NextRouter["replace"]>(
  router: NextRouter,
  originalHandler: T
): T => {
  return ((href, as, ...args) => {
    const network = router.query.network;
    if (network) {
      as += `?network=${network}`;
    }
    return originalHandler(href, as, ...args);
  }) as T;
};

const App: AppType = React.memo(
  ({ Component, currentNearNetwork, language, pageProps }) => {
    const router = useRouter();
    React.useEffect(() => {
      router.replace = wrapHandler(router, router.replace);
      router.push = wrapHandler(router, router.push);
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
        currentNetwork: currentNearNetwork,
        networks: nearNetworks,
      }),
      [currentNearNetwork, nearNetworks]
    );

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
        <NetworkContext.Provider value={networkState}>
          <AppWrapper>
            <Header />
            <BackgroundImage src="/static/images/explorer-bg.svg" />
            <Component {...pageProps} />
          </AppWrapper>
          <Footer />
        </NetworkContext.Provider>
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
  }
);

App.getInitialProps = async (appContext) => {
  const req = appContext.ctx.req;
  let initialProps: Omit<AppInitialProps, "pageProps">;
  if (req) {
    // Being server-side can be detected with 'req' existence
    const language = getLanguage(
      LANGUAGES,
      req.headers.cookie,
      req.headers["accept-language"]
    );
    initialProps = {
      currentNearNetwork: getNearNetwork(
        appContext.ctx.query,
        req.headers.host
      ),
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
    initialProps = {
      currentNearNetwork: getNearNetwork(
        appContext.ctx.query,
        window.location.host
      ),
    };
  }

  return {
    ...(await NextApp.getInitialProps(appContext as AppContext)),
    ...initialProps,
  };
};

export default App;
