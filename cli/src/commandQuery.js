const { Connection, prompt } = require("./utils");

exports.default = async function(argv) {
  let sqlQuery = await prompt("Enter SQL (e.g. `SELECT * FROM nodes`):");

  let connection = new Connection(argv.endpoint);
  let session;
  try {
    session = await connection.open();
  } catch (error) {
    console.error("Connection failure due to:", error);
    return;
  }

  let result;
  try {
    result = await session.call(
      `com.nearprotocol.${argv["chain-id"]}.explorer.select`,
      [sqlQuery]
    );
  } catch (error) {
    console.error("Failed to call the query function due to:", error);
    return;
  } finally {
    connection.close();
  }

  console.log("Query result:");
  console.log(result);
};
