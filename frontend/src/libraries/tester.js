import React from "react";
import renderer from "react-test-renderer";
import { setI18N } from "./language";
import { LocalizeProvider, withLocalize } from "react-localize-redux";

export const renderI18nElement = (nextElement, options) => {
  return renderer.create(
    <LocalizeProvider>
      <LocalizedWrapperComponent>{nextElement}</LocalizedWrapperComponent>
    </LocalizeProvider>,
    options
  );
};

class WrapperComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    setI18N(this.props);
  }

  render() {
    const { children } = this.props;
    return <>{children}</>;
  }
}

const LocalizedWrapperComponent = withLocalize(WrapperComponent);
