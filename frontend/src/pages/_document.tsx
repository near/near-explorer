import NextDocument, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentProps,
  DocumentContext,
  DocumentInitialProps,
} from "next/document";
import { ReactElement } from "react";
import { getCssText } from "../libraries/stitches.config";

interface DocumentType {
  (props: DocumentProps): ReactElement;
  getInitialProps?: (context: DocumentContext) => Promise<DocumentInitialProps>;
}

const Document: DocumentType = () => {
  return (
    <Html>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/css/bootstrap.min.css"
          crossOrigin="anonymous"
        />
        <style
          id="stitches"
          dangerouslySetInnerHTML={{ __html: getCssText() }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

Document.getInitialProps = NextDocument.getInitialProps;

export default Document;
