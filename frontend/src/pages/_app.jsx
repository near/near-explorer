import App from "next/app";
import getConfig from "next/config";
import Head from "next/head";

import { Container } from "react-bootstrap";

import Header from "../components/utils/Header";
import Footer from "../components/utils/Footer";
import DataProvider from "../components/utils/DataProvider";

import "bootstrap/dist/css/bootstrap.min.css";

const {
  publicRuntimeConfig: { nearNetworks, nearNetworkAliases, googleAnalytics }
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
      currentNearNetwork = nearNetworkAliases[appContext.ctx.req.headers.host];
    } else {
      currentNearNetwork = nearNetworkAliases[window.location.host];
    }
    return {
      currentNearNetwork,
      ...(await App.getInitialProps({ ...appContext, currentNearNetwork }))
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
          <Header />
          <div className="page">
            <Container>
              <Component {...pageProps} />
            </Container>
          </div>
          <Footer />
        </DataProvider>
        <style jsx global>{`
          body {
            background-color: #f8f8f8;
          }

          a {
            text-decoration: none;
          }

          a:hover {
            text-decoration: none;
          }

          .page {
            background: white;
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
                `
              }}
            />
          </>
        ) : null}
      </>
    );
  }
}
