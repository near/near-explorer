import App, { Container } from "next/app";

import DataProvider from "../components/utils/DataProvider";

class NearExplorer extends App {
  // static async getInitialProps({ Component, ctx }) {
  //   let pageProps = {};
  //   if (Component.getInitialProps) {
  //     pageProps = await Component.getInitialProps(ctx);
  //   }
  //
  //   return {
  //     pageProps,
  //     // dataProviderProps: await DataProvider.getInitialProps(ctx)
  //   };
  // }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <DataProvider>
          <Component {...pageProps} />
        </DataProvider>
      </Container>
    );
  }
}

export default NearExplorer;
