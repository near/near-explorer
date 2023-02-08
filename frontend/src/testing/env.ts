import i18next from "i18next";
import JSDomEnvironment from "jest-environment-jsdom";
import { initReactI18next } from "react-i18next";

import { getDateLocale } from "@explorer/frontend/libraries/date-locale";

export default class extends JSDomEnvironment {
  async setup() {
    await super.setup();
    const i18nInstance = i18next.createInstance();
    await i18nInstance.use(initReactI18next).init({
      lng: "cimode",
      resources: {},
    });
    // Will use this variables in renderElement
    this.global.i18nInstance = i18nInstance;
    this.global.locale = await getDateLocale("cimode");
  }
}
