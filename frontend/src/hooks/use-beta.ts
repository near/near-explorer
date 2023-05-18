import { useBetaOptions } from "@/frontend/hooks/use-beta-options";

export const useBeta = () => Boolean(useBetaOptions()[0]?.enabled);
