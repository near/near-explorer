import { getConfig, NearNetwork } from "../config";

export async function call<T, Args extends unknown[]>(
  procedure: string,
  nearNetwork: NearNetwork,
  args: Args
): Promise<T> {
  const {
    publicRuntimeConfig: { backendConfig },
  } = getConfig();
  const baseUrl = `${backendConfig.secure ? "https" : "http"}://${
    backendConfig.host
  }:${backendConfig.port}/`;
  const response = await fetch(
    baseUrl + procedure + `?network=${nearNetwork.name}`,
    {
      method: "POST",
      body: JSON.stringify(args),
    }
  );
  const json = await response.json();
  return json as T;
}
