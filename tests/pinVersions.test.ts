// tests/pinVersions.test.ts

import { describe, it, expect } from "vitest";

import { findUnpinnedDependencies } from "../src/core/pinVersions.js";
import type { PackageJson } from "../src/core/types.js";

describe("findUnpinnedDependencies", () => {
  it("returns empty array when all dependencies are pinned", () => {
    const pkg: PackageJson = {
      dependencies: {
        react: "18.2.0",
        next: "14.1.0",
      },
      devDependencies: {
        typescript: "5.6.0",
      },
    };

    const issues = findUnpinnedDependencies(pkg);
    expect(issues.length).toBe(0);
  });

  it("detects range versions in dependencies and devDependencies", () => {
    const pkg: PackageJson = {
      dependencies: {
        react: "^18.2.0",
      },
      devDependencies: {
        typescript: "~5.6.0",
      },
    };

    const issues = findUnpinnedDependencies(pkg);
    const names = issues.map((i) => i.name);

    expect(issues.length).toBe(2);
    expect(names).toContain("react");
    expect(names).toContain("typescript");
  });

  it("detects missing versions", () => {
    const pkg: PackageJson = {
      dependencies: {
        react: "",
      },
    };

    const issues = findUnpinnedDependencies(pkg);

    expect(issues.length).toBe(1);
    expect(issues[0].reason).toBe("missing-version");
  });
});
