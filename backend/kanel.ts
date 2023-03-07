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
  defaultGetPropertyMetadata,
} from "kanel";
import path from "path";

import { config } from "@explorer/backend/config";
import { notNullGuard } from "@explorer/common/utils/utils";

type DatabaseName = string;
type TableName = string;
type TableField = string;

const ACTIONS_TYPE = `
| {
  public_key: string;
  access_key: {
    nonce: number;
    permission:
      | {
          permission_kind: "FUNCTION_CALL";
          permission_details: {
            allowance: string;
            receiver_id: string;
            method_names: string[];
          };
        }
      | {
          permission_kind: "FULL_ACCESS";
        };
  };
}
| {}
| { beneficiary_id: string; }
| { public_key: string; }
| { code_sha256: string; }
| {
  gas: number;
  deposit: string;
  method_name: string;
  args_json?: Record<string, unknown>;
  args_base64: string;
}
| {
  public_key: string;
  stake: string;
}
| { deposit: string; }
`;

const TYPE_OVERRIDES: Record<
  DatabaseName,
  Record<TableName, Record<TableField, string>>
> = {
  readOnlyIndexer: {
    action_receipt_actions: {
      args: ACTIONS_TYPE,
    },
    transaction_actions: {
      args: ACTIONS_TYPE,
    },
  },
};

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
      const databaseTypesOverride = TYPE_OVERRIDES[database];
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
          getPropertyMetadata: (
            property,
            details,
            generateFor,
            instantiatedConfig
          ) => {
            const metadata = defaultGetPropertyMetadata(
              property,
              details,
              generateFor,
              instantiatedConfig
            );
            if (!databaseTypesOverride) {
              return metadata;
            }
            const tableTypesOverride = databaseTypesOverride[details.name];
            if (!tableTypesOverride) {
              return metadata;
            }
            const columnTypeOverride = tableTypesOverride[property.name];
            if (!columnTypeOverride) {
              return metadata;
            }
            return { ...metadata, typeOverride: columnTypeOverride };
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
