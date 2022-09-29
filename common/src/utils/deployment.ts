type DeployEnvironment = {
  environment: "production" | "staging" | "local";
  serviceId: string;
  instanceId: string;
};

// NB: Environment variables are render.com-specific
// You should change them if running on another deployment provider
export const getDeployEnvironment = (): DeployEnvironment => {
  if (!process.env.RENDER) {
    return {
      environment: "local",
      serviceId: "local",
      instanceId: "local",
    };
  }
  return {
    environment: process.env.IS_PULL_REQUEST ? "staging" : "production",
    serviceId: process.env.RENDER_SERVICE_ID || "unknown",
    instanceId: process.env.RENDER_INSTANCE_ID || "unknown",
  };
};
