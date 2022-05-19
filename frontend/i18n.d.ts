import { I18nNamespace, ResourceType } from "./src/libraries/i18n";

declare module "react-i18next" {
  interface CustomTypeOptions {
    defaultNS: I18nNamespace;
    resources: ResourceType;
  }
}
