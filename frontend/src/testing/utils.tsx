import * as React from "react";
import * as ReactQuery from "react-query";
import { i18n } from "i18next";
import { setI18n } from "react-i18next";
import renderer, {
  ReactTestRenderer,
  TestRendererOptions,
} from "react-test-renderer";
import fetch from "isomorphic-fetch";
import { NetworkContext } from "@explorer/frontend/context/NetworkContext";
import { LanguageContext } from "@explorer/frontend/context/LanguageContext";
import { trpc } from "@explorer/frontend/libraries/trpc";
import { Locale } from "@explorer/frontend/libraries/date-locale";

const networkContext: NetworkContext = {
  networkName: "localnet",
  networks: {
    localnet: {
      explorerLink: "http://explorer/",
      nearWalletProfilePrefix: "http://wallet/profile",
    },
  },
};

// Variables were set in testing/env.ts
declare global {
  var i18nInstance: i18n;
  var locale: Locale;
}

export const renderElement = (
  nextElement: React.ReactNode,
  options?: TestRendererOptions
): ReactTestRenderer => {
  setI18n(global.i18nInstance);
  let root: ReactTestRenderer;
  const queryClient = new ReactQuery.QueryClient();
  const client = trpc.createClient({
    url: "http://localhost/",
    fetch,
  });
  const languageContext: LanguageContext = {
    language: "en",
    setLanguage: () => {},
    locale: global.locale,
  };
  renderer.act(() => {
    root = renderer.create(
      <trpc.Provider queryClient={queryClient} client={client}>
        <ReactQuery.QueryClientProvider client={queryClient}>
          <LanguageContext.Provider value={languageContext}>
            <NetworkContext.Provider value={networkContext}>
              {nextElement}
            </NetworkContext.Provider>
          </LanguageContext.Provider>
        </ReactQuery.QueryClientProvider>
      </trpc.Provider>,
      options
    );
  });
  return root!;
};
