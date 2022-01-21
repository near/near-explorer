import "../libraries/wdyr";
import NextApp from "next/app";
import getConfig from "next/config";
import Head from "next/head";
import { useMemo } from "react";

import { getNearNetwork, NearNetwork } from "../libraries/config";

import Header from "../components/utils/Header";
import Footer from "../components/utils/Footer";
import { NetworkContext } from "../context/NetworkContext";
import DatabaseProvider from "../context/DatabaseProvider";

import { getLanguage, LANGUAGE_COOKIE } from "../libraries/language";
import { useAnalyticsInit } from "../hooks/analytics/use-analytics-init";
import { initializeI18n, Language, LANGUAGES } from "../libraries/i18n";
import { NextComponentType } from "next";
import { AppContextType, AppPropsType } from "next/dist/shared/lib/utils";
import { Router } from "next/router";
import { setI18n } from "react-i18next";
import { YEAR } from "../libraries/time";
import { globalCss, styled } from "../libraries/stitches.config";

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

type InitialProps = {
  language?: Language;
  currentNearNetwork: NearNetwork;
};

type AppType = NextComponentType<
  AppContextType<Router>,
  InitialProps,
  AppPropsType & InitialProps
>;

const App: AppType = ({
  Component,
  currentNearNetwork,
  language,
  pageProps,
}) => {
  if (typeof window !== "undefined" && language) {
    // There is no react way of waiting till i18n is initialized before render
    // But at the moment SSR should render content properly
    void initializeI18n(language);
  }
  useAnalyticsInit();
  globalStyles();

  const networkState = useMemo(
    () => ({
      currentNetwork: currentNearNetwork,
      networks: nearNetworks,
    }),
    [currentNearNetwork, nearNetworks]
  );

  return (
    <>
      <Head>
        <link rel="shortcut icon" type="image/png" href="/static/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <NetworkContext.Provider value={networkState}>
        <AppWrapper>
          <Header />
          <BackgroundImage src="/static/images/explorer-bg.svg" />
          <DatabaseProvider>
            <Component {...pageProps} />
          </DatabaseProvider>
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
};

App.getInitialProps = async (appContext) => {
  const req = appContext.ctx.req;
  let initialProps: InitialProps;
  if (req) {
    // Being server-side can be detected with 'req' existence
    const language = getLanguage(
      LANGUAGES,
      req.headers.cookie,
      req.headers["accept-language"]
    );
    initialProps = {
      currentNearNetwork: getNearNetwork(req),
      language,
    };
    setI18n(await initializeI18n(language));
    appContext.ctx.res!.setHeader(
      "set-cookie",
      `${LANGUAGE_COOKIE}=${language}; Max-Age=${YEAR / 1000}`
    );
  } else {
    // This branch is called only on page change hence we don't need to calculate language at the moment
    // as i18next is already configured
    initialProps = {
      currentNearNetwork: getNearNetwork(),
    };
  }

  return {
    ...(await NextApp.getInitialProps(appContext)),
    ...initialProps,
  };
};

export default App;
