import App, { Container } from "next/app";
import Head from "next/head";

import Header from "../components/Header";
import Footer from "../components/Footer";
import DataProvider from "../components/utils/DataProvider";

class NearExplorer extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <Head>
          <link
            rel="shortcut icon"
            type="image/png"
            href="/static/favicon.ico"
          />
        </Head>
        <DataProvider>
          <Header />
          <Component {...pageProps} />
          <Footer />
        </DataProvider>
        <style jsx global>{`
          body {
            background-color: #f8f8f8;
          }
        `}</style>
      </Container>
    );
  }
}

export default NearExplorer;
