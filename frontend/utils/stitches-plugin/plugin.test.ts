import { transformSync } from "@babel/core";
import test from "ava";
import fs from "fs";
import path from "path";

const trim = (str: string) => str.replaceAll(/^\s+|\s+$/g, "");

const snapshotsDir = path.join(__dirname, "snapshots");
fs.readdirSync(snapshotsDir).forEach((testName) => {
  const snapshotDir = path.join(snapshotsDir, testName);

  test(`plugin works for ${testName.split("-").join(" ")}`, (t) => {
    const input = fs.readFileSync(path.join(snapshotDir, "input.js"), {
      encoding: "utf-8",
    });
    const output = fs.readFileSync(path.join(snapshotDir, "output.js"), {
      encoding: "utf-8",
    });
    t.is(
      trim(
        transformSync(input, {
          filename: "input.js",
          babelrc: false,
          plugins: [path.join(__dirname, "./plugin.ts")],
        })!.code!
      ),
      trim(output)
    );
  });
});
