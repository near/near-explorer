import * as React from "react";
import Placeholder, { Props as PlaceholderProps } from "./Placeholder";

import { useTranslation } from "react-i18next";
import { styled } from "../../libraries/styles";

const UpdateWrapper = styled(Placeholder, {
  "&:active": {
    background: "rgba(106, 209, 227, 0.5)",
  },
});

const Update: React.FC<PlaceholderProps> = React.memo(({ children }) => {
  const { t } = useTranslation();
  return (
    <UpdateWrapper>
      {children}
      {t("utils.Update.refresh")}
    </UpdateWrapper>
  );
});

export default Update;
