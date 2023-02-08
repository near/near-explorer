const typescriptRules = [
    "@typescript-eslint/switch-exhaustiveness-check",
    "@typescript-eslint/naming-convention",
    "@typescript-eslint/dot-notation",
    "@typescript-eslint/no-implied-eval",
    "@typescript-eslint/no-throw-literal",
    "@typescript-eslint/return-await",
];

module.exports = {
    root: true,
    extends: [
        "airbnb",
        "airbnb/hooks",
        "airbnb-typescript",
        "plugin:@next/next/recommended",
        "prettier",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "tsconfig.json",
    },
    plugins: ["no-relative-import-paths"],
    rules: {
        "react/function-component-definition": [
            "error",
            {
                namedComponents: "arrow-function",
                unnamedComponents: "arrow-function",
            },
        ],
        "no-void": ["error", { allowAsStatement: true }],
        "react/require-default-props": "off",
        "@next/next/no-html-link-for-pages": ["warn", "./frontend/src/pages"],
        // Typescript version of default-case below
        "default-case": "off",
        "@typescript-eslint/switch-exhaustiveness-check": "error",
        "eact/jsx-props-no-spreading": "off",
        "jsx-a11y/aria-role": "off",
        "no-return-assign": ["error", "except-parens"],
        "react/jsx-no-useless-fragment": ["error", { allowExpressions: true }],
        "no-nested-ternary": "off",
        "import/prefer-default-export": "off",
        "react/prop-types": "off",
        "react/jsx-props-no-spreading": "off",
        "consistent-return": "off",
        "import/order": [
            "error",
            {
                groups: [
                    ["builtin", "external"],
                    "internal",
                    "parent",
                    "sibling",
                ],
                warnOnUnassignedImports: false,
                "newlines-between": "always",
                alphabetize: {
                    order: "asc",
                },
                pathGroups: [
                    {
                        pattern: "{react,react-dom}",
                        group: "builtin",
                        position: "before",
                    },
                    {
                        pattern: "@explorer/**",
                        group: "internal",
                        position: "before",
                    },
                ],
                pathGroupsExcludedImportTypes: [
                    "react",
                    "react-native",
                    "@explorer",
                ],
            },
        ],
        "no-console": "error",
        "no-alert": "error",
        "no-param-reassign": ["error", { props: false }],
        "no-relative-import-paths/no-relative-import-paths": [
            "error",
            { allowSameFolder: true },
        ],
    },
    overrides: [
        {
            files: ["*.json"],
            parser: "jsonc-eslint-parser",
            rules: typescriptRules.reduce(
                (acc, rule) => ({ ...acc, [rule]: "off" }),
                {}
            ),
        },
    ],
};
