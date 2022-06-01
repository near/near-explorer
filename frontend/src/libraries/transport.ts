import { NetworkName } from "../types/common";
import { getConfig } from "./config";

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
} = getConfig();
export const getBackendUrl = (networkName: NetworkName, type: Protocol) => {
  if (!backendConfig.hosts[networkName]) {
    throw new Error(`Network ${networkName} is not supported on this host`);
  }
  const protocols = backendConfig.secure ? secureProtocols : insecureProtocols;
  return `${protocols[type]}://${backendConfig.hosts[networkName]}:${backendConfig.port}/${endpoints[type]}`;
};
