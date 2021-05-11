import App from "next/app";
import getConfig from "next/config";
import Head from "next/head";

import { getNearNetwork } from "../libraries/config";
import Mixpanel from "../libraries/mixpanel";

import Header from "../components/utils/Header";
import Footer from "../components/utils/Footer";
import NetworkProvider from "../context/NetworkProvider";
import DatabaseProvider from "../context/DatabaseProvider";

import "bootstrap/dist/css/bootstrap.min.css";

const {
  publicRuntimeConfig: { nearNetworks, googleAnalytics },
} = getConfig();

class _App extends App {
  static async getInitialProps(appContext) {
    // WARNING: Do not remove this getInitialProps implementation as it
    // will enable Automatic Prerendering, which does not work fine with
    // `publicRuntimeConfig`:
    //
    // > Note: A page that relies on publicRuntimeConfig must use
    // > `getInitialProps` to opt-out of automatic prerendering. You can
    // > also de-optimize your entire application by creating a Custom
    // > `<App>` with `getInitialProps`.
    //
    // https://github.com/zeit/next.js#runtime-configuration

    let currentNearNetwork;
    if (typeof window === "undefined") {
      currentNearNetwork = getNearNetwork(appContext.ctx.req.headers.host);
    } else {
      currentNearNetwork = getNearNetwork(window.location.host);
    }
    return {
      currentNearNetwork,
      ...(await App.getInitialProps({ ...appContext, currentNearNetwork })),
    };
  }

  componentDidMount() {
    // mixpanel user setup and tracking
    Mixpanel.identify(Mixpanel.get_distinct_id());
    Mixpanel.people.set_once({ first_touch_date: new Date().toString() });
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <>
        <Head>
          <link
            rel="shortcut icon"
            type="image/png"
            href="/static/favicon.ico"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
            rel="stylesheet"
          />
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <NetworkProvider
          currentNearNetwork={this.props.currentNearNetwork}
          nearNetworks={nearNetworks}
        >
          <div className="app-wrapper">
            <Header />
            <img
              src="/static/images/explorer-bg.svg"
              className="background-img"
            />
            <DatabaseProvider>
              <Component
                {...pageProps}
                currentNearNetwork={this.props.currentNearNetwork}
              />
            </DatabaseProvider>
          </div>
          <Footer />
        </NetworkProvider>
        <style jsx global>{`
          body {
            background-color: #f9f9f9;
            height: 100%;
            margin: 0;
            font-family: "Inter", sans-serif;
          }
          .background-img {
            position: absolute;
            right: 0;
            top: 72px;
            z-index: -1;
          }

          a {
            text-decoration: none;
          }

          a:hover {
            text-decoration: none;
          }

          h1 {
            font-weight: 900;
            word-wrap: break-word;
            color: #24272a;
            font-size: 32px;
          }

          @media (max-width: 300px) {
            h1 {
              font-size: 28px;
            }
          }

          @media (min-width: 1600px) {
            h1 {
              font-size: 48px;
            }
          }

          h2 {
            font-size: 24px;
          }

          .app-wrapper {
            position: relative;
            min-height: calc(100vh - 120px);
          }
        `}</style>
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
}

export default _App;
