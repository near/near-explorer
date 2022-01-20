import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import JSDomEnvironment from "jest-environment-jsdom";

export default class extends JSDomEnvironment {
  async setup() {
    await super.setup();
    const i18nInstance = i18next.createInstance();
    await i18nInstance.use(initReactI18next).init({
      lng: "cimode",
      resources: {},
    });
    // Will use this instance in renderElement
    this.global.i18nInstance = i18nInstance;
  }
}
