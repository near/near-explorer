import i18next, { i18n } from "i18next";
import JSDomEnvironment from "jest-environment-jsdom";
import { initReactI18next } from "react-i18next";

import {
  getCachedDateLocale,
  fetchDateLocale,
  Locale,
  setCachedDateLocale,
} from "@explorer/frontend/libraries/date-locale";

/* eslint-disable vars-on-top, no-var */
declare global {
  var i18nInstance: i18n;
  var locale: Locale;
}
/* eslint-enable vars-on-top, no-var */

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
    if (!getCachedDateLocale("cimode")) {
      setCachedDateLocale("cimode", await fetchDateLocale("cimode"));
    }
    this.global.locale = getCachedDateLocale("cimode")!;
  }
}
