// src/core/types.ts

export interface PackageJson {
  name?: string;
  version?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

export type DependencySection = "dependencies" | "devDependencies";

export type DependencyIssueReason = "range-version" | "missing-version";

export interface DependencyIssue {
  name: string;
  version: string;
  type: DependencySection;
  reason: DependencyIssueReason;
}
