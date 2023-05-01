import * as React from "react";

import fetch from "isomorphic-fetch";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { NextRouter } from "next/router";
import { setI18n } from "react-i18next";
import * as ReactQuery from "react-query";
import renderer, {
  ReactTestRenderer,
  TestRendererOptions,
} from "react-test-renderer";

import {
  NetworkContext,
  NetworkContextType,
} from "@explorer/frontend/context/NetworkContext";
import { setCachedDateLocale } from "@explorer/frontend/libraries/date-locale";
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

const mockRouter: NextRouter = {
  basePath: "",
  pathname: "/",
  route: "/",
  asPath: "/",
  query: {},
  push: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  prefetch: jest.fn(),
  beforePopState: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  isFallback: false,
  isLocaleDomain: false,
  isReady: false,
  isPreview: false,
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
  setCachedDateLocale("cimode", global.cachedLocale);
  renderer.act(() => {
    root = renderer.create(
      <trpc.Provider queryClient={queryClient} client={client}>
        <ReactQuery.QueryClientProvider client={queryClient}>
          <NetworkContext.Provider value={networkContext}>
            <RouterContext.Provider value={mockRouter}>
              {nextElement}
            </RouterContext.Provider>
          </NetworkContext.Provider>
        </ReactQuery.QueryClientProvider>
      </trpc.Provider>,
      options
    );
  });
  return root!;
};
