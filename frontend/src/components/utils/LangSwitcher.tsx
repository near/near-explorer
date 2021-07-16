import React from "react";
import { withLocalize } from "react-localize-redux";
import { setMomentLocale } from "../../libraries/language";

interface Lang {
  code: string;
  name: string;
}

const LanguageToggle = ({
  languages,
  activeLanguage,
  setActiveLanguage,
}: any) => {
  const selectLangauge = (code: string) => {
    setActiveLanguage(code);
    localStorage.setItem("languageCode", code);
    setMomentLocale(code);
  };

  return (
    <>
      <select
        className="lang-selector"
        name="lang"
        value={activeLanguage && activeLanguage.code}
        onChange={(e) => selectLangauge(e.target.value)}
      >
        {languages.map((lang: Lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </>
  );
};

export default withLocalize(LanguageToggle);
