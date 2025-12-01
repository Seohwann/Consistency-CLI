# 🛠️ Consistency CLI Tool

협업 프론트엔드 프로젝트에서 라이브러리 버전, 특수문자 포함 등으로 인한 개발 환경의 파편화를 막고, 코드 품질의 일관성을 유지하기 위해 제작된 TypeScript 기반의 CLI 도구입니다.

> 팀원마다 설치한 라이브러리 버전이 달라서 발생하는 빌드 오류와, 서로 다른 코드 스타일로 인한 리뷰의 비효율을 해결하기 위해 만들었습니다.

---

## 🪟 배경 (Background)

산학협력 프로젝트를 진행하며 함께 제휴를 맺은 기업인 Databrain의 'MAHA'라는 AI 퍼포먼스 마케터를 개발하는 중 프론트엔드 팀 리드로서 겪었던 문제를 해결하는 과정에서 아이디어를 생각해내어 만들게 되었습니다.

당시 저희 팀은 캠페인 생성 페이지와 같이 여러 탭으로 구성되어 각 탭에 해당하는 페이지를 여러 팀원이 각각 나누어 개발하고 있었습니다. 이 과정에서 두 가지 큰 문제가 지속적으로 발생했습니다.

1. 의존성 버전 불일치 문제
팀원마다 React, Next.js 등을 포함한 여러 라이브러리 버전이 미세하게 달랐습니다. 이로 인해 특정 팀원의 로컬 환경에서는 정상 작동하던 코드가, 다른 팀원의 로컬이나 CI 환경에서는 빌드 오류를 일으키는 현상이 빈번했습니다.

2. 코드 스타일 파편화
여러 명이 하나의 프로젝트를 작업하다 보니 Format, Lint 규칙이 통일되지 않았습니다. 결과적으로 탭별로 코드 스타일이 섞이게 되어 가독성도 떨어지고, PR 리뷰 시 코드의 로직을 해석하는 데 많은 시간이 소요되었습니다.

### 해결책
이 문제를 해결하기 위해 저는 프로젝트의 package.json 내 모든 의존성 버전을 가장 안정적인 정확한 버전(Exact Version)으로 고정하여 팀원들과 공유했습니다. 또한 커밋 전 Prettier와 ESLint 실행을 강제하여 코드의 일관성을 확보했습니다.

Consistency CLI는 이러한 저의 경험과 해결책을 자동화하여, 다른 프로젝트에서도 손쉽게 적용할 수 있도록 만든 도구입니다.

---

## ✏️ 주요 기능 (Features)

이 CLI 도구는 다음과 같은 기능을 제공하여 개발 환경의 일관성을 보장합니다.

### 1. 의존성 버전 검사 및 고정 (Dependency Pinning)
package.json 파일을 분석하여 Tilde(~)나 Caret(^)과 같은 범위 버전을 사용하는 의존성을 찾아냅니다. 개발자가 이를 확인하고 정확한 버전으로 고정하도록 안내하여, 모든 팀원이 동일한 의존성 환경을 갖추도록 돕습니다.

### 2. 통합 품질 검사 (One-pass Consistency Check)
명령어 하나로 코드의 스타일, 오류, 기능, 빌드 가능 여부를 순차적으로 검증합니다.
- format: Prettier를 실행하여 코드 스타일을 통일합니다.
- lint: ESLint를 통해 잠재적인 오류를 정적 분석합니다.
- test: Vitest를 사용하여 유닛 테스트를 수행합니다.
- build: TypeScript 컴파일을 통해 빌드 오류가 없는지 확인합니다.

⚠️ `eslint`와 `prettier`
`eslint`와 `prettier`를 통해 프로젝트 코드의 모든 `.ts` 파일에 동일한 포맷/코드 규칙을 강제
- 들여쓰기: 2 space, 줄 간 공백 일관화, 큰 블록 간 빈 줄 삽입 강제
- 따옴표: double quotes(`"example"`)로 통일
- import: 외부 → 내부 → 상수 그룹 순서 정렬, 그룹 간 1줄 공백 필수
- 함수: return type 명시 필수
- Node globals(console, process)는 허용하도록 환경 선언 추가
- format → lint → test → build가 모두 통과해야 CI도 `exit 0` 으로 통합 실행되도록 `npm run check` 로 묶음
---

## ⭐ 시작하기

### 사전 요구 사항
- Node.js (LTS 버전 권장)
- npm 혹은 yarn

### 설치
프로젝트 루트에서 아래 명령어를 통해 의존성을 설치합니다.

`npm install --save-dev https://github.com/Seohwann/Consistency-CLI.git`

### 사용 방법 (Usage)

1. 의존성 버전 검사
현재 프로젝트의 package.json을 읽어 범위 버전(^, ~ 등)을 사용하는 의존성을 찾아냅니다.

`npx consistency`

2. 일관성 검사 (Consistency Check)
Consistency CLI를 프로젝트의 품질 게이트로 사용하려면,
package.json의 scripts 섹션에 다음과 같이 정의해서 한 번에 검사하는 관문으로 묶어줍니다.

`{
  "scripts": {
    "consistency": "npx consistency",
    "format": "prettier --write \"src/**/*.ts\" \"tests/**/*.ts\"",
    "lint": "eslint \"src/**/*.ts\" \"tests/**/*.ts\"",
    "test": "vitest run",
    "build": "tsc -p tsconfig.build.json",
    "check": "npm run consistency && npm run format && npm run lint && npm run test && npm run build"
  }
}
`


이제 아래 명령어 한 번으로 일관성 검사를 수행할 수 있습니다.
포맷팅, 린트, 테스트, 빌드를 한 번에 수행합니다. CI 파이프라인이나 커밋 전 훅(Hook)으로 사용하기 적합합니다.

`npm run check`

---

## 라이선스 (License)

MIT License
