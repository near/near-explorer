const nearlib = require("nearlib");

const { nearRpcUrl } = require("./config");

const nearRpc = new nearlib.providers.JsonRpcProvider(nearRpcUrl);

exports.nearRpc = nearRpc;
