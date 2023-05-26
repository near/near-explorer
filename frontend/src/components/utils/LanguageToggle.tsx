import * as React from "react";

import { useLanguage } from "@/frontend/hooks/use-language";
import { Language, LANGUAGES } from "@/frontend/libraries/i18n";
import { styled } from "@/frontend/libraries/styles";

const languagesIcon = "/static/images/icon-languages.svg";
const downArrowIcon = "/static/images/down-arrow.svg";

const LangSelector = styled("select", {
  appearance: "none",
  border: 0,
  cursor: "pointer",
  fontSize: 16,
  height: 32,
  outline: "none",
  position: "relative",
  userSelect: "none",
  zIndex: 1,

  "&::-ms-expand": {
    display: "none",
  },

  variants: {
    type: {
      mobile: {
        background: `url(${languagesIcon}) no-repeat 0px center / 24px 24px, url(${downArrowIcon}) no-repeat 95% / 16px`,
        color: "#f8f8f8",
        paddingRight: 62,
        width: "100%",
        textIndent: 32,
      },
      desktop: {
        background: `url(${languagesIcon}) no-repeat 10px center / 20px 20px, url(${downArrowIcon}) no-repeat 85% 12px / 10px`,
        paddingRight: 54,
        width: 54,
        textIndent: 54,
      },
    },
  },
  defaultVariants: {
    type: "desktop",
  },
});

const LANGUAGE_NAMES: Record<Language, string> = {
  en: "English",
  "zh-Hant": "繁體中文",
  "zh-Hans": "简体中文",
  vi: "Tiếng Việt",
  ru: "Русский",
  uk: "Українська",
};

type Props = {
  mobile?: boolean;
};

export const LanguageToggle: React.FC<Props> = React.memo((props) => {
  const [language, setLanguage, isQuery] = useLanguage();
  if (isQuery) {
    return null;
  }

  return (
    <LangSelector
      name="lang"
      value={language}
      onChange={(e) => setLanguage(e.currentTarget.value)}
      type={props.mobile ? "mobile" : "desktop"}
    >
      {LANGUAGES.map((langCode) => (
        <option key={langCode} value={langCode}>
          {LANGUAGE_NAMES[langCode]}
        </option>
      ))}
    </LangSelector>
  );
});
