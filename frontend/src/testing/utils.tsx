import * as React from "react";
import * as ReactQuery from "react-query";
import { setI18n } from "react-i18next";
import renderer, {
  ReactTestRenderer,
  TestRendererOptions,
} from "react-test-renderer";
import { NetworkContext } from "../context/NetworkContext";
import { setMomentLanguage } from "../libraries/language";
import { createQueryClient } from "../libraries/queries";

const networkContext: NetworkContext = {
  networkName: "localhostnet",
  networks: {
    localhostnet: {
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
  const queryClient = createQueryClient();
  throw new Error("Find out how to fix warning in jest console");
  renderer.act(() => {
    root = renderer.create(
      <ReactQuery.QueryClientProvider client={queryClient}>
        <NetworkContext.Provider value={networkContext}>
          {nextElement}
        </NetworkContext.Provider>
      </ReactQuery.QueryClientProvider>,
      options
    );
  });
  return root!;
};
