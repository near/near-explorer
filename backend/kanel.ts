import { processDatabase } from "kanel";
import path from "path";
// @ts-ignore
import { recase } from "@kristiandupont/recase";
import { databaseConfigs } from "./src/database/configs";

const run = async () => {
  for (const [database, config] of Object.entries(databaseConfigs)) {
    // The model is the same as readOnlyTelemetryDatabase
    // And we probably don't have credentials to connect to it
    if (database === "writeOnlyTelemetryDatabase") {
      continue;
    }
    console.log(`\n> Generating types for ${database}...`);
    try {
      await processDatabase({
        connection: config,
        preDeleteModelFolder: true,
        customTypeMap: {
          bytea: "Buffer",
          jsonb: "Record<string, unknown>",
        },
        modelNominator: recase("snake", "pascal"),
        typeNominator: recase("snake", "pascal"),
        fileNominator: recase("pascal", "dash"),
        schemas: [
          {
            name: "public",
            ignore: ["__diesel_schema_migrations"],
            modelFolder: path.join(__dirname, "src/database/models", database),
          },
        ],
      });
      console.log(`< Types for ${database} successfully generated!`);
    } catch (e) {
      console.error(`< Error generating types for ${database}:`, e);
      process.exit(1);
    }
  }
};

void run();
