import React from "react";
import { withLocalize } from "react-localize-redux";
import { setMomentLocale } from "../../libraries/language";
import Cookies from "universal-cookie";

interface Lang {
  code: string;
  name: string;
}

const LanguageToggle = ({
  languages,
  activeLanguage,
  setActiveLanguage,
}: any) => {
  const selectLanguage = (code: string) => {
    setActiveLanguage(code);
    new Cookies().set("NEXT_LOCALE", code);
    setMomentLocale(code);
  };

  return (
    <>
      <select
        className="lang-selector"
        name="lang"
        value={activeLanguage && activeLanguage.code}
        onChange={(e) => selectLanguage(e.target.value)}
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
