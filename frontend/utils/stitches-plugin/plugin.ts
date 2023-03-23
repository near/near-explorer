import { PluginObj, types } from "@babel/core";
import * as t from "@babel/types";
import path from "path";

// A tribute to https://github.com/LucasUnplugged/babel-plugin-named-stitches-classnames

const getModifiedCallee = (id: string) =>
  t.callExpression(
    t.memberExpression(t.identifier("styled"), t.identifier("withConfig")),
    [
      t.objectExpression([
        t.objectProperty(t.identifier("displayName"), t.stringLiteral(id)),
      ]),
    ]
  );

const extractName = (
  node: t.Expression | t.PrivateName | t.LVal
): string | undefined => {
  if (t.isIdentifier(node)) {
    return node.name;
  }
  if (t.isStringLiteral(node)) {
    return node.value;
  }
};

const getNameByFilename = (filename: string) => {
  const displayName = path.basename(filename, path.extname(filename));

  if (displayName === "index") {
    // ./{module name}/index.js
    return path.basename(path.dirname(filename));
  }
  return displayName;
};

const plugin = (): PluginObj => ({
  name: "named-stitches-classes",
  visitor: {
    ExportDefaultDeclaration: (nodePath, state) => {
      const { node } = nodePath;

      if (
        types.isCallExpression(node.declaration) &&
        types.isIdentifier(node.declaration.callee) &&
        node.declaration.callee.name === "styled"
      ) {
        node.declaration.callee = getModifiedCallee(
          getNameByFilename(state.filename || "unknown")
        );
        nodePath.replaceWith(node);
      }
    },
    CallExpression: (nodePath) => {
      const { node } = nodePath;
      if (
        !types.isCallExpression(node) ||
        !types.isIdentifier(node.callee) ||
        node.callee.name !== "styled"
      ) {
        return;
      }
      // crawl up the ancestry looking for possible candidates for displayName inference
      let id: string | undefined;

      // ensure that we have an identifier we can inherit from
      nodePath.find((subNodePath) => {
        if (subNodePath.isAssignmentExpression()) {
          id = extractName(subNodePath.node.left);
          return true;
        }
        if (subNodePath.isObjectProperty()) {
          id = extractName(subNodePath.node.key);
          return true;
        }
        if (subNodePath.isVariableDeclarator()) {
          id = extractName(subNodePath.node.id);
          return true;
        }
        // we've hit a statement, we should stop crawling up
        return subNodePath.isStatement();
      });

      if (!id) {
        // foo.bar -> bar
        return;
      }

      node.callee = getModifiedCallee(id);
      nodePath.replaceWith(node);
    },
  },
});

export default plugin;
