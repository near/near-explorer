import { PureComponent } from "react";
import { setI18N } from "../../libraries/language";
import { withLocalize } from "react-localize-redux";

class LocalizeWrapper extends PureComponent {
  constructor(props) {
    super(props);
    setI18N(this.props);
  }

  render() {
    const { children } = this.props;
    return <>{children}</>;
  }
}

export default withLocalize(LocalizeWrapper);
