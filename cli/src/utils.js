const autobahn = require("autobahn");

const standard_input = process.stdin;
standard_input.setEncoding("utf-8");

exports.Connection = class {
  constructor(wampNearExplorerUrl) {
    this.connection = new autobahn.Connection({
      realm: "near-explorer",
      transports: [
        {
          url: wampNearExplorerUrl,
          type: "websocket"
        }
      ],
      retry_if_unreachable: true,
      max_retries: Number.MAX_SAFE_INTEGER,
      max_retry_delay: 10
    });
  }

  open() {
    return new Promise((resolve, reject) => {
      this.connection.onopen = session => resolve(session);
      this.connection.onclose = reason => reject(reason);
      this.connection.open();
    });
  }

  close() {
    this.connection._transport.onclose = () => {};
    this.connection.close();
  }
};

exports.prompt = function(msg) {
  console.log(msg);
  return new Promise(resolve => {
    standard_input.on("data", data => {
      standard_input.destroy();
      resolve(data);
    });
  });
};
