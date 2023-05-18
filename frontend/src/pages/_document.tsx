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

import { getCssText } from "@/frontend/libraries/styles";

interface DocumentType {
  (props: DocumentProps): React.ReactNode;
  getInitialProps?: (context: DocumentContext) => Promise<DocumentInitialProps>;
}

/* eslint-disable react/no-danger */
const Document: DocumentType = React.memo((ctx) => (
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
      <link
        href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;500;700&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Source+Code+Pro&display=swap"
        rel="stylesheet"
      />
      <style id="stitches" dangerouslySetInnerHTML={{ __html: getCssText() }} />
      {/* see https://github.com/vercel/next.js/discussions/35064 */}
      {/* eslint-disable-next-line no-underscore-dangle */}
      {ctx.__NEXT_DATA__.query.iframe ? (
        // This version is pinned in alpha.near.org VM
        // See https://github.com/NearSocial/VM/releases/tag/1.2.0
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/4.3.6/iframeResizer.contentWindow.min.js"
          async
        />
      ) : null}
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
));

Document.getInitialProps = NextDocument.getInitialProps;

export default Document;
