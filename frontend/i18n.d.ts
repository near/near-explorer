import { I18nNamespace, ResourceType } from "@explorer/frontend/libraries/i18n";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: I18nNamespace;
    resources: ResourceType;
  }
}
