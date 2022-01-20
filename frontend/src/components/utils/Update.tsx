import Placeholder, { Props as PlaceholderProps } from "./Placeholder";

import { useTranslation } from "react-i18next";

const Update = ({ children }: PlaceholderProps) => {
  const { t } = useTranslation();
  return (
    <Placeholder className="update">
      {children}
      {t("utils.Update.refresh")}
      <style>{`
      .update:active{
        background: rgba(106, 209, 227, 0.5)
      }
      `}</style>
    </Placeholder>
  );
};

export default Update;
