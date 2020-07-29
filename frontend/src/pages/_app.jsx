import App from "next/app";
import getConfig from "next/config";
import Head from "next/head";

import { getNearNetwork } from "../libraries/config";

import Header from "../components/utils/Header";
import Footer from "../components/utils/Footer";
import DataProvider from "../components/utils/DataProvider";
import SubscriptionProvider from "../context/SubscriptionProvider";
import NodeProvider from "../context/NodeProvider";

import "bootstrap/dist/css/bootstrap.min.css";

const {
  publicRuntimeConfig: { nearNetworks, googleAnalytics },
} = getConfig();

export default class extends App {
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
        </Head>
        <DataProvider
          currentNearNetwork={this.props.currentNearNetwork}
          nearNetworks={nearNetworks}
        >
          <SubscriptionProvider>
            <NodeProvider>
              <div className="app-wrapper">
                <Header />
                <div className="page">
                  <Component {...pageProps} />
                </div>
              </div>
              <Footer />
            </NodeProvider>
          </SubscriptionProvider>
        </DataProvider>
        <style jsx global>{`
          @font-face {
            font-family: "BentonSans";
            font-weight: 500;
            src: url("/static/fonts/BentonSans-Medium.otf") format("opentype");
          }

          @font-face {
            font-family: "BentonSans";
            font-weight: 300;
            src: url("/static/fonts/BentonSans-Regular.otf") format("opentype");
          }

          @font-face {
            font-family: "BwSeidoRound";
            font-weight: 500;
            src: url("/static/fonts/Branding-with-Type-Bw-Seido-Round-Medium.otf")
              format("opentype");
          }

          @font-face {
            font-family: "BwSeidoRound";
            font-weight: 300;
            src: url("/static/fonts/Branding-with-Type-Bw-Seido-Round-Light.otf")
              format("opentype");
          }

          @font-face {
            font-family: "BwSeidoRound";
            font-weight: 400;
            src: url("/static/fonts/Branding-with-Type-Bw-Seido-Round-Regular.otf")
              format("opentype");
          }

          body {
            background-color: white;
            height: 100%;
            margin: 0;
          }

          a {
            text-decoration: none;
          }

          a:hover {
            text-decoration: none;
          }

          h1,
          h2,
          .modal-title {
            font-family: BwSeidoRound;
            font-weight: 500;
            color: #24272a;
          }

          h1 {
            font-size: calc(
              28px + (48 - 28) * ((100vw - 300px) / (1600 - 300))
            );
            word-wrap: break-word;
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

          h2,
          .modal-title {
            font-size: 24px;
          }

          .modal-body {
            font-family: BentonSans;
            font-weight: 300;
          }

          .page {
            background: white;
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
