import prometheus, { Registry } from "prom-client";
import { IncomingMessage } from "http";
import { getDeployEnvironment } from "./deployment";
import { getGitData } from "./git";

type GatewayOptions = {
  url: string;
  user: string;
  password: string;
};

export const resolveGatewayOptions = (): GatewayOptions | null => {
  const url = process.env.PUSH_GATEWAY_URL;
  if (!url) {
    return null;
  }
  const user = process.env.PUSH_GATEWAY_USER;
  if (!user) {
    return null;
  }
  const password = process.env.PUSH_GATEWAY_PASSWORD;
  if (!password) {
    return null;
  }
  return {
    url,
    user,
    password,
  };
};

export const startPrometheusPush = async (
  registry: Registry,
  jobName: string,
  interval = 1000
) => {
  const options = resolveGatewayOptions();
  if (!options) {
    console.warn("Not all prometheus push gateway env variables are set");
    return () => {};
  }
  const gateway = new prometheus.Pushgateway(
    options.url,
    {
      headers: {
        Auth: `Basic ${Buffer.from(
          options.user + ":" + options.password
        ).toString("base64")}`,
      },
    },
    registry
  );
  const gitData = await getGitData();
  const deployEnvironment = getDeployEnvironment();
  const intervalId = setInterval(async () => {
    try {
      const res = await gateway.pushAdd({
        jobName,
        groupings: { ...gitData, ...deployEnvironment },
      });
      const response = res.resp as IncomingMessage;
      const statusCode = response.statusCode || 0;
      if (statusCode < 200 || statusCode >= 300) {
        throw new Error(
          `Status code ${statusCode}, "${response.statusMessage}"`
        );
      }
    } catch (e) {
      console.error("Error on pushing metrics to gateway", e);
    }
  }, interval);
  return () => clearInterval(intervalId);
};
