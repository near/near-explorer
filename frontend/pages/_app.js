import App, { Container } from "next/app";

import DataProvider from "../components/utils/DataProvider";

class NearExplorer extends App {
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
