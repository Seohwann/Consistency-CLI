import type { PackageJson, DependencyIssue } from "./types.js";
/**
 * 현재 디렉토리(또는 지정 디렉토리)의 package.json을 읽는다.
 */
export declare function loadPackageJson(cwd?: string): PackageJson;
/**
 * pinned 되지 않은(범위 버전이거나 버전이 비어 있는) 의존성을 찾아낸다.
 */
export declare function findUnpinnedDependencies(pkg: PackageJson): DependencyIssue[];
//# sourceMappingURL=pinVersions.d.ts.map