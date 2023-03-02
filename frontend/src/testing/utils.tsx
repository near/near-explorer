import * as React from "react";

import fetch from "isomorphic-fetch";
import { noop } from "lodash";
import { setI18n } from "react-i18next";
import * as ReactQuery from "react-query";
import renderer, {
  ReactTestRenderer,
  TestRendererOptions,
} from "react-test-renderer";

import {
  LanguageContext,
  LanguageContextType,
} from "@explorer/frontend/context/LanguageContext";
import {
  NetworkContext,
  NetworkContextType,
} from "@explorer/frontend/context/NetworkContext";
import { setCachedDateLocale } from "@explorer/frontend/libraries/date-locale";
import { Language } from "@explorer/frontend/libraries/i18n";
import { trpc } from "@explorer/frontend/libraries/trpc";

const networkContext: NetworkContextType = {
  networkName: "localnet",
  networks: {
    localnet: {
      explorerLink: "http://explorer/",
      nearWalletProfilePrefix: "http://wallet/profile",
    },
  },
};

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
  const languageContext: LanguageContextType = {
    language: "cimode" as Language,
    setLanguage: noop,
  };
  setCachedDateLocale("cimode", global.locale);
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
