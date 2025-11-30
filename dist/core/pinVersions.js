// src/core/pinVersions.ts
import fs from "node:fs";
import path from "node:path";
/**
 * 현재 디렉토리(또는 지정 디렉토리)의 package.json을 읽는다.
 */
export function loadPackageJson(cwd = process.cwd()) {
    const pkgPath = path.join(cwd, "package.json");
    const content = fs.readFileSync(pkgPath, "utf-8");
    const json = JSON.parse(content);
    return json;
}
/**
 * ^, ~, > 같은 범위 버전인지 검사
 */
function isPinned(version) {
    const trimmed = version.trim();
    return !/^[\^~><=]/.test(trimmed);
}
/**
 * pinned 되지 않은(범위 버전이거나 버전이 비어 있는) 의존성을 찾아낸다.
 */
export function findUnpinnedDependencies(pkg) {
    const issues = [];
    const checkSection = (deps, section) => {
        if (!deps)
            return;
        for (const [name, version] of Object.entries(deps)) {
            const trimmed = (version ?? "").trim();
            if (!trimmed) {
                issues.push({
                    name,
                    version: "",
                    type: section,
                    reason: "missing-version",
                });
                continue;
            }
            if (!isPinned(trimmed)) {
                issues.push({
                    name,
                    version: trimmed,
                    type: section,
                    reason: "range-version",
                });
            }
        }
    };
    checkSection(pkg.dependencies, "dependencies");
    checkSection(pkg.devDependencies, "devDependencies");
    return issues;
}
//# sourceMappingURL=pinVersions.js.map