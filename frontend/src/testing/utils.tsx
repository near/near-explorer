import * as React from "react";
import * as ReactQuery from "react-query";
import { setI18n } from "react-i18next";
import renderer, {
  ReactTestRenderer,
  TestRendererOptions,
} from "react-test-renderer";
import fetch from "isomorphic-fetch";
import { NetworkContext } from "../context/NetworkContext";
import { setMomentLanguage } from "../libraries/language";
import { trpc } from "../libraries/trpc";

const networkContext: NetworkContext = {
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
  // Instance was set to global in testing/env.ts
  setI18n((global as any).i18nInstance);
  setMomentLanguage("en");
  let root: ReactTestRenderer;
  const queryClient = new ReactQuery.QueryClient();
  const client = trpc.createClient({
    url: "http://localhost/",
    fetch,
  });
  renderer.act(() => {
    root = renderer.create(
      <trpc.Provider queryClient={queryClient} client={client}>
        <ReactQuery.QueryClientProvider client={queryClient}>
          <NetworkContext.Provider value={networkContext}>
            {nextElement}
          </NetworkContext.Provider>
        </ReactQuery.QueryClientProvider>
      </trpc.Provider>,
      options
    );
  });
  return root!;
};
