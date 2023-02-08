import * as React from "react";

import NextDocument, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentProps,
  DocumentContext,
  DocumentInitialProps,
} from "next/document";

import { getCssText } from "@explorer/frontend/libraries/styles";

interface DocumentType {
  (props: DocumentProps): React.ReactNode;
  getInitialProps?: (context: DocumentContext) => Promise<DocumentInitialProps>;
}

const Document: DocumentType = React.memo(() => (
  <Html>
    <Head>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/css/bootstrap.min.css"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />
      <style id="stitches" dangerouslySetInnerHTML={{ __html: getCssText() }} />
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
));

Document.getInitialProps = NextDocument.getInitialProps;

export default Document;
