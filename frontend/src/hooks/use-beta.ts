import { useBetaOptions } from "./use-beta-options";

export const useBeta = () => Boolean(useBetaOptions()[0]?.enabled);
