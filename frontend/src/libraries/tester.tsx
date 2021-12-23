import renderer, {
  ReactTestRenderer,
  TestRendererOptions,
} from "react-test-renderer";
import { LocalizeProvider } from "react-localize-redux";
import LocalizeWrapper from "../components/utils/LocalizeWrapper";
import { NetworkContext } from "../context/NetworkContext";

const networkContext = {
  currentNetwork: {
    name: "testing",
    explorerLink: "http://explorer/",
    aliases: ["alias1"],
    nearWalletProfilePrefix: "http://wallet/profile",
  },
  networks: [],
};

export const renderI18nElement = (
  nextElement: React.ReactNode,
  options?: TestRendererOptions
): ReactTestRenderer => {
  let root: ReactTestRenderer;
  renderer.act(() => {
    root = renderer.create(
      <NetworkContext.Provider value={networkContext}>
        <LocalizeProvider>
          <LocalizeWrapper>{nextElement}</LocalizeWrapper>
        </LocalizeProvider>
      </NetworkContext.Provider>,
      options
    );
  });
  return root!;
};
