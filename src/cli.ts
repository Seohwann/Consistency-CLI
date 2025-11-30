#!/usr/bin/env node
// src/cli.ts

import { loadPackageJson, findUnpinnedDependencies } from "./core/pinVersions.js";

function printIssuesAndExit(): void {
  const pkg = loadPackageJson();
  const issues = findUnpinnedDependencies(pkg);

  if (issues.length === 0) {
    console.log("✅ All dependencies are pinned to exact versions. Workspace is consistent.");
    process.exit(0);
  }

  console.log("⚠️  Found unpinned or inconsistent dependencies:\n");

  for (const issue of issues) {
    const reasonText = issue.reason === "range-version" ? "version range used" : "missing version";
    console.log(`- [${issue.type}] ${issue.name}@${issue.version} (${reasonText})`);
  }

  console.log("\nPlease pin these dependencies to exact versions (e.g. 1.2.3).");

  // CI나 pre-commit에서 실패로 인식하게 하기 위해 non-zero code 반환
  process.exit(1);
}

function main(): void {
  // 나중에 커맨드/옵션이 늘어나면 여기서 분기
  printIssuesAndExit();
}

main();
