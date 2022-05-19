import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import JSDomEnvironment from "jest-environment-jsdom";
import { TextEncoder, TextDecoder } from "util";

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
    this.global.TextEncoder = TextEncoder;
    // Types between DOM TextDecoder and node.js TextDecoder don't match
    // But we need to have some kind of polyfill for autobahn to not throw errors
    // @ts-ignore
    this.global.TextDecoder = TextDecoder;
  }
}
