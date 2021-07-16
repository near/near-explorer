import renderer from "react-test-renderer";
import { LocalizeProvider } from "react-localize-redux";
import LocalizeWrapper from "../components/utils/LocalizeWrapper";

export const renderI18nElement = (nextElement, options) => {
  return renderer.create(
    <LocalizeProvider>
      <LocalizeWrapper>{nextElement}</LocalizeWrapper>
    </LocalizeProvider>,
    options
  );
};
