import { setI18n } from "react-i18next";
import renderer, {
  ReactTestRenderer,
  TestRendererOptions,
} from "react-test-renderer";
import { NetworkContext } from "../context/NetworkContext";
import { setMomentLanguage } from "../libraries/language";

const networkContext: NetworkContext = {
  currentNetwork: {
    name: "testnet",
    explorerLink: "http://explorer/",
    aliases: ["alias1"],
    nearWalletProfilePrefix: "http://wallet/profile",
  },
  networks: [],
};

export const renderElement = (
  nextElement: React.ReactNode,
  options?: TestRendererOptions
): ReactTestRenderer => {
  // Instance was set to global in testing/env.ts
  setI18n((global as any).i18nInstance);
  setMomentLanguage("en");
  let root: ReactTestRenderer;
  renderer.act(() => {
    root = renderer.create(
      <NetworkContext.Provider value={networkContext}>
        {nextElement}
      </NetworkContext.Provider>,
      options
    );
  });
  return root!;
};
