import renderer, {
  ReactTestRenderer,
  TestRendererOptions,
} from "react-test-renderer";
import { LocalizeProvider } from "react-localize-redux";
import LocalizeWrapper from "../components/utils/LocalizeWrapper";

export const renderI18nElement = (
  nextElement: React.ReactNode,
  options?: TestRendererOptions
): ReactTestRenderer => {
  let root: ReactTestRenderer;
  renderer.act(() => {
    root = renderer.create(
      <LocalizeProvider>
        <LocalizeWrapper>{nextElement}</LocalizeWrapper>
      </LocalizeProvider>,
      options
    );
  });
  return root!;
};
