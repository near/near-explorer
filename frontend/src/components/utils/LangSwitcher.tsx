import React from "react";
import { withLocalize } from "react-localize-redux";

interface Lang {
  code: string;
  name: string;
}

const LanguageToggle = ({
  languages,
  activeLanguage,
  setActiveLanguage,
}: any) => {
  return (
    <>
      <select
        className="lang-selector"
        name="lang"
        value={activeLanguage && activeLanguage.code}
        onChange={(e) => setActiveLanguage(e.target.value)}
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
