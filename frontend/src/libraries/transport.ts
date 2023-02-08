import { NetworkName } from "@explorer/common/types/common";
import { getConfig } from "@explorer/frontend/libraries/config";

type Protocol = "http" | "websocket";
const secureProtocols: Record<Protocol, string> = {
  http: "https",
  websocket: "wss",
};
const insecureProtocols: Record<Protocol, string> = {
  http: "http",
  websocket: "ws",
};
const endpoints: Record<Protocol, string> = {
  http: "trpc",
  websocket: "ws",
};
const {
  publicRuntimeConfig: { backendConfig },
  serverRuntimeConfig: { backendConfig: ssrBackendConfig },
} = getConfig();
export const getBackendUrl = (
  networkName: NetworkName,
  type: Protocol,
  ssr: boolean
) => {
  const config = ssr ? ssrBackendConfig : backendConfig;
  if (!config.hosts[networkName]) {
    throw new Error(`Network ${networkName} is not supported on this host`);
  }
  const protocols = config.secure ? secureProtocols : insecureProtocols;
  return `${protocols[type]}://${config.hosts[networkName]}:${config.port}/${endpoints[type]}`;
};
