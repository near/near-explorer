import Placeholder, { Props as PlaceholderProps } from "./Placeholder";

import { Translate } from "react-localize-redux";

const Update = ({ children }: PlaceholderProps) => {
  return (
    <Translate>
      {({ translate }) => (
        <Placeholder className="update">
          {children}
          {translate("utils.Update.refresh")}
          <style>{`
      .update:active{
        background: rgba(106, 209, 227, 0.5)
      }
      `}</style>
        </Placeholder>
      )}
    </Translate>
  );
};

export default Update;
