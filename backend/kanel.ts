import { recase } from "@kristiandupont/recase";
import {
  generateIndexFile,
  processDatabase,
  defaultGetMetadata,
  FileContents,
  Details,
  Declaration,
  TypeImport,
  defaultGenerateIdentifierType,
  PreRenderHook,
} from "kanel";
import path from "path";

import { config } from "@explorer/backend/config";
import { notNullGuard } from "@explorer/common/utils/utils";

type TableDetails = Extract<Details, { kind: "table" }>;

const generateInterfaceDeclaration = (
  name: string,
  properties: { name: string; value: string }[],
  typeImports?: TypeImport[]
): Declaration => ({
  declarationType: "interface",
  name,
  properties: properties.map((property) => ({
    name: property.name,
    dimensions: 0,
    isNullable: false,
    isOptional: false,
    typeName: property.value,
  })),
  exportAs: "named",
  typeImports,
});

const generateTypedImport = (
  name: string,
  importPath: string,
  isDefault = false
) => ({
  name,
  path: `./${importPath}`,
  isDefault,
  isAbsolute: true,
  importAsType: true,
});

const generateTypeMappings: PreRenderHook = async (
  outputAcc,
  instantiatedConfig
) => {
  const tables = Object.values(instantiatedConfig.schemas)
    .reduce<TableDetails[]>((acc, schema) => [...acc, ...schema.tables], [])
    .map((details) => {
      const selectorMetadata = instantiatedConfig.getMetadata(
        details,
        "selector",
        instantiatedConfig
      );
      const initializerMetadata = instantiatedConfig.getMetadata(
        details,
        "initializer",
        instantiatedConfig
      );
      const mutatorMetadata = instantiatedConfig.getMetadata(
        details,
        "mutator",
        instantiatedConfig
      );
      return {
        name: details.name,
        selectorName: selectorMetadata.name,
        initializerName: initializerMetadata.name,
        mutatorName: mutatorMetadata.name,
        importPath: path.relative(
          instantiatedConfig.outputPath,
          selectorMetadata.path
        ),
      };
    })
    .filter(notNullGuard);

  const typedImports = tables.reduce<TypeImport[]>(
    (acc, table) => [
      ...acc,
      generateTypedImport(table.selectorName, table.importPath, true),
      generateTypedImport(table.initializerName, table.importPath),
      generateTypedImport(table.mutatorName, table.importPath),
    ],
    []
  );

  const declarations: Declaration[] = [
    generateInterfaceDeclaration(
      "SelectorModelTypeMap",
      tables.map(({ name, selectorName: value }) => ({ name, value })),
      typedImports
    ),
    generateInterfaceDeclaration(
      "InitializerModelTypeMap",
      tables.map(({ name, initializerName: value }) => ({ name, value })),
      typedImports
    ),
    generateInterfaceDeclaration(
      "MutatorModelTypeMap",
      tables.map(({ name, mutatorName: value }) => ({ name, value })),
      typedImports
    ),
  ];

  const indexPath = path.join(instantiatedConfig.outputPath, "index");
  const prevFile: FileContents = outputAcc[indexPath] || { declarations: [] };

  return {
    ...outputAcc,
    [indexPath]: {
      declarations: [...prevFile.declarations, ...declarations],
    },
  };
};

/* eslint-disable no-console */

const run = async () => {
  await Promise.all(
    Object.entries(config.db).map(async ([database, dbConfig]) => {
      if (
        // The model is the same as readOnlyTelemetryDatabase
        // And we probably don't have credentials to connect to it
        database === "writeOnlyTelemetry" ||
        // We don't have public credentials for readOnlyIndexerActivityDatabase
        database === "readOnlyIndexerActivity"
      ) {
        return;
      }
      console.log(`\n> Generating types for ${database}...`);
      try {
        await processDatabase({
          connection: dbConfig,
          preDeleteOutputFolder: true,
          customTypeMap: {
            bytea: "Buffer",
            jsonb: "Record<string, unknown>",
          },
          getMetadata: (...args) => {
            const result = defaultGetMetadata(...args);
            const splittedPath = result.path.split("/");
            result.path = [
              ...splittedPath.slice(0, -2),
              recase("pascal", "dash")(splittedPath[splittedPath.length - 1]),
            ].join("/");
            return result;
          },
          generateIdentifierType: (...args) => {
            const result = defaultGenerateIdentifierType(...args);
            const match = result.typeDefinition[0].match(
              /^(.*?) & { __brand: '(.*?)' }$/
            );
            if (!match) {
              return result;
            }
            return {
              ...result,
              typeDefinition: [`${match[1]} & { __flavor?: '${match[2]}' }`],
            };
          },
          typeFilter: (type) =>
            type.kind !== "table" || type.name !== "__diesel_schema_migrations",
          enumStyle: "type",
          preRenderHooks: [generateIndexFile, generateTypeMappings],
          schemas: ["public"],
          outputPath: path.join(__dirname, "src/database/models", database),
        });
        console.log(`< Types for ${database} successfully generated!`);
      } catch (e) {
        console.error(`< Error generating types for ${database}:`, e);
        process.exit(1);
      }
    })
  );
};

/* eslint-enable no-console */

void run();
