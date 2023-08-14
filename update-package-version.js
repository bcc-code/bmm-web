#!/usr/env node
import { readFileSync, writeFileSync } from "fs";
import { execSync } from "child_process";

writeFileSync(
  "package.json",
  `${JSON.stringify(
    {
      ...JSON.parse(readFileSync("package.json")),
      version: execSync("git describe --tags")
        .toString()
        .trim()
        .replace(
          /^v([0-9]+)(?:\.([0-9]+))?(?:\.([0-9]+))?(?:-([0-9]+))?(?:-g([0-9a-z]+))?.*$/,
          (_, major, minor, patch, commitCount, objectIdentifier) =>
            [
              `${parseInt(major ?? "0", 10)}.${parseInt(minor ?? "0", 10)}.${
                // Increment patch by 1 if we're not exactly at a tag.
                // For discussion see: https://github.com/bcc-code/bmm-web/pull/185
                parseInt(patch ?? "0", 10) + (commitCount ? 1 : 0)
              }`,
              ...[commitCount, objectIdentifier].filter((x) => !!x),
            ].join("-")
        ),
    },
    null,
    2
  )}\n`
);
