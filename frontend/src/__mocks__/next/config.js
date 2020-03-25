const defaultWampNearExplorerUrl = "ws://localhost:8080/ws";

module.exports = () => ({
  publicRuntimeConfig: {
    nearNetworks: {
      name: "localhostnet",
      explorerLink: "http://localhost:3000",
      aliases: ["localhost:3000", "localhost", "127.0.0.1", "127.0.0.1:3000"]
    },
    nearNetworkAliases: {
      aliases: ["localhost:3000", "localhost", "127.0.0.1", "127.0.0.1:3000"]
    },
    wampNearExplorerUrl:
      process.env.WAMP_NEAR_EXPLORER_URL || defaultWampNearExplorerUrl,
    googleAnalytics: process.env.NEAR_EXPLORER_GOOGLE_ANALYTICS
  }
});
