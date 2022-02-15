import React, { useEffect } from "react";
import { LANGUAGE_COOKIE, setMomentLanguage } from "../../libraries/language";
import { useTranslation } from "react-i18next";
import {
  DEFAULT_LANGUAGE,
  Language,
  LANGUAGES,
  resources,
} from "../../libraries/i18n";
import { useCookie } from "../../hooks/use-cookie";
import { styled } from "../../libraries/styles";

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
  "zh-Hans": "简体中文",
  vi: "Tiếng Việt",
  ru: "Русский",
};

type Props = {
  mobile?: boolean;
};

const LanguageToggle: React.FC<Props> = (props) => {
  const { i18n, ready } = useTranslation();
  const [language, setLanguage] = useCookie(LANGUAGE_COOKIE, DEFAULT_LANGUAGE);
  useEffect(() => {
    if (!ready) {
      return;
    }
    Object.entries(resources[language]).forEach(([namespace, resource]) => {
      if (!i18n.hasResourceBundle(language, namespace)) {
        i18n.addResourceBundle(language, namespace, resource);
      }
    });
    i18n.changeLanguage(language);
    setMomentLanguage(language);
  }, [i18n, language, ready]);

  return (
    <LangSelector
      name="lang"
      value={i18n.language}
      onChange={(e) => setLanguage(e.currentTarget.value as Language)}
      type={props.mobile ? "mobile" : "desktop"}
    >
      {LANGUAGES.map((langCode) => (
        <option key={langCode} value={langCode}>
          {LANGUAGE_NAMES[langCode]}
        </option>
      ))}
    </LangSelector>
  );
};

export default LanguageToggle;
