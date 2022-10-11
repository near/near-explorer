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

export const getBearerToken = (): string | null => {
  const token = process.env.PROMETHEUS_PULL_TOKEN;
  if (!token) {
    return null;
  }
  return token;
};
