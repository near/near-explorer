// @ts-ignore
import { recase } from "@kristiandupont/recase";
import { processDatabase } from "kanel";
import path from "path";

import { config } from "@explorer/backend/config";

const run = async () => {
  for (const [database, dbConfig] of Object.entries(config.db)) {
    if (
      // The model is the same as readOnlyTelemetryDatabase
      // And we probably don't have credentials to connect to it
      database === "writeOnlyTelemetry" ||
      // We don't have public credentials for readOnlyIndexerActivityDatabase
      database === "readOnlyIndexerActivity"
    ) {
      continue;
    }
    console.log(`\n> Generating types for ${database}...`);
    try {
      await processDatabase({
        connection: dbConfig,
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
