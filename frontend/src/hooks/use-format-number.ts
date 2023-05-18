import React from "react";

import { useLanguage } from "@/frontend/hooks/use-language";

export const useFormatNumber = () => {
  const [language] = useLanguage();
  return React.useCallback(
    (input: number) => input.toLocaleString(language),
    [language]
  );
};
