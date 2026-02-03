# Package.json 설정 가이드

본 문서는 `@rm/mf-boilerplate-library` 프로젝트의 package.json 파일에 대한 상세한 설명을 제공합니다.

---

## 📦 기본 패키지 정보

### `name: "@rm/mf-boilerplate-library"`

**설명**: npm 패키지의 고유 이름입니다.

- `@rm/` 스코프를 사용하여 조직 레벨의 패키지임을 명시
- Micro Frontend 환경에서 다른 애플리케이션이 이 라이브러리를 참조할 때 사용
- **이유**: 스코프 네이밍으로 패키지 충돌을 방지하고 조직 내 패키지 관리 용이

### `private: true`

**설명**: 이 패키지가 공개 npm 레지스트리에 게시되지 않도록 방지합니다.

- **이유**:
  - 내부 사용 전용 라이브러리
  - 실수로 공개 저장소에 배포되는 것을 방지
  - 조직 내부에서만 사용되는 공유 라이브러리

### `version: "0.1.0"`

**설명**: 현재 패키지의 버전 (Semantic Versioning)

- 형식: MAJOR.MINOR.PATCH
- 0.1.0 = 초기 개발 단계
- **관리 규칙**:
  - MAJOR: 하위 호환성이 깨지는 변경
  - MINOR: 하위 호환성을 유지하는 기능 추가
  - PATCH: 버그 수정

### `type: "module"`

**설명**: ES 모듈 시스템을 사용함을 명시

- **이유**:
  - 최신 JavaScript 표준인 ESM (ES Modules) 사용
  - `import/export` 문법 지원
  - 트리 쉐이킹(Tree Shaking) 최적화 가능
  - CommonJS 대신 모던한 모듈 시스템 채택

---

## 📂 진입점(Entry Points) 설정

### `main: "./dist/index.js"`

**설명**: 패키지의 기본 진입점

- Node.js 환경 또는 구형 번들러에서 사용
- **이유**: 하위 호환성 유지

### `module: "./dist/index.js"`

**설명**: ES 모듈 진입점

- 최신 번들러(Webpack, Rollup, Vite)가 우선적으로 참조
- **이유**: 트리 쉐이킹 최적화를 위한 ESM 진입점 제공

### `types: "./dist/index.d.ts"`

**설명**: TypeScript 타입 정의 파일 위치

- TypeScript 프로젝트에서 타입 안정성 제공
- **이유**: 타입 지원으로 개발자 경험(DX) 향상

---

## 🎯 Exports 설정 (서브패스 패턴)

### 왜 Exports를 사용하는가?

- **모듈별 독립적인 import 지원**: 필요한 모듈만 선택적으로 가져올 수 있음
- **번들 크기 최적화**: 전체 라이브러리가 아닌 필요한 부분만 번들에 포함
- **명확한 API 경계**: 공개할 모듈과 내부 모듈을 명확히 구분

### `".": { ... }`

```json
".": {
  "import": "./dist/index.js",
  "types": "./dist/index.d.ts"
}
```

**설명**: 루트 진입점 - 전체 라이브러리 import
**사용 예시**:

```typescript
import { Button, useDebounce } from '@rm/mf-boilerplate-library';
```

**이유**: 모든 export를 한 번에 가져올 수 있는 기본 진입점

### `"./components": { ... }`

```json
"./components": {
  "import": "./dist/components/index.js",
  "types": "./dist/components/index.d.ts"
}
```

**설명**: 컴포넌트만 독립적으로 import
**사용 예시**:

```typescript
import { Button, Card, Input } from '@rm/mf-boilerplate-library/components';
```

**이유**: UI 컴포넌트만 필요한 경우 번들 크기 최소화

### `"./hooks": { ... }`

**설명**: React 커스텀 훅만 import
**사용 예시**:

```typescript
import { useDebounce, useLocalStorage } from '@rm/mf-boilerplate-library/hooks';
```

**이유**: 훅 로직만 필요한 경우 가벼운 번들

### `"./utils": { ... }`

**설명**: 유틸리티 함수만 import
**사용 예시**:

```typescript
import { formatDate, validateEmail } from '@rm/mf-boilerplate-library/utils';
```

**이유**: 순수 함수만 필요할 때 React 의존성 없이 사용

### `"./services": { ... }`

**설명**: API 클라이언트 등 서비스 레이어 import
**사용 예시**:

```typescript
import { apiClient } from '@rm/mf-boilerplate-library/services';
```

**이유**: 데이터 통신 로직 분리

### `"./store": { ... }`

**설명**: 상태 관리(Zustand) 스토어 import
**사용 예시**:

```typescript
import { useThemeStore } from '@rm/mf-boilerplate-library/store';
```

**이유**: 전역 상태 관리 독립성 유지

### `"./types": { ... }`

**설명**: TypeScript 타입 정의만 import
**사용 예시**:

```typescript
import type { CommonType } from '@rm/mf-boilerplate-library/types';
```

**이유**: 타입만 필요한 경우 런타임 코드 없이 사용

### `"./constants": { ... }`

**설명**: 상수 값만 import
**사용 예시**:

```typescript
import { API_BASE_URL } from '@rm/mf-boilerplate-library/constants';
```

**이유**: 설정 값과 상수만 필요한 경우

### `"./styles": "./dist/styles/app.css"`

**설명**: CSS 파일 직접 import
**사용 예시**:

```typescript
import '@rm/mf-boilerplate-library/styles';
```

**이유**:

- Tailwind CSS 기반 스타일 공유
- 전역 스타일 별도 관리
- 스타일만 선택적으로 적용 가능

---

## 📁 Files 설정

### `files: ["dist", "README.md"]`

**설명**: npm 패키지 배포 시 포함될 파일/폴더 지정

- `dist`: 빌드된 결과물 (실제 사용될 코드)
- `README.md`: 패키지 문서
  **이유**:
- 불필요한 파일(src, tests, config) 제외로 패키지 크기 최소화
- 빌드된 파일만 배포하여 보안성 향상
- 다운로드 속도 개선

---

## 🚀 Scripts 설정

### `dev: "vite"`

**설명**: 개발 서버 실행
**명령어**: `npm run dev`
**동작**:

- Vite 개발 서버 시작
- 핫 모듈 리플레이스먼트(HMR) 활성화
- 빠른 개발 환경 제공
  **사용 시점**: 개발 중 컴포넌트 테스트 및 확인

### `build: "tsc -b tsconfig.build.json && vite build"`

**설명**: 프로덕션 빌드
**명령어**: `npm run build`
**동작**:

1. `tsc -b tsconfig.build.json`: TypeScript 컴파일러로 타입 정의 파일(.d.ts) 생성
   - `tsconfig.build.json` 설정 파일 명시적 사용
   - `emitDeclarationOnly: true`로 타입 파일만 생성
2. `vite build`: 프로덕션 번들 생성 (최적화, 압축)
   - `vite-plugin-dts`가 추가 타입 파일 생성 및 최적화
   - `preserveModules: true`로 원본 폴더 구조 유지
     **이유**:

- TypeScript 컴파일러와 Vite 플러그인을 조합하여 완전한 타입 정의 생성
- 순차 실행(`&&`)으로 타입 체크 실패 시 빌드 중단
- Module Federation과 일반 라이브러리 사용을 모두 지원
  **사용 시점**: 배포 전 최종 빌드

### `lint: "eslint . --ext .js,.jsx,.ts,.tsx"`

**설명**: 코드 품질 검사 (읽기 전용)
**명령어**: `npm run lint`
**동작**:

- ESLint로 코드 스타일 및 잠재적 오류 검사
- JavaScript/TypeScript/React 파일 대상
  **이유**:
- 코드 품질 유지
- 팀 내 코딩 컨벤션 통일
- CI/CD 파이프라인에서 자동 검증
  **사용 시점**: 커밋 전, CI/CD 파이프라인

### `lint:fix: "eslint . --ext .js,.jsx,.ts,.tsx --fix"`

**설명**: 코드 품질 검사 + 자동 수정
**명령어**: `npm run lint:fix`
**동작**:

- ESLint 검사 수행 후 자동 수정 가능한 문제 자동으로 고침
  **사용 시점**: 개발 중 빠른 수정

### `format: "prettier --check ./src"`

**설명**: 코드 포맷팅 검사 (읽기 전용)
**명령어**: `npm run format`
**동작**:

- Prettier로 코드 포맷 규칙 준수 여부 확인
- src 폴더 내 파일만 대상
  **이유**:
- 일관된 코드 스타일 유지
- CI에서 포맷팅 검증
  **사용 시점**: CI/CD 파이프라인

### `format:fix: "prettier --write ./src"`

**설명**: 코드 포맷팅 자동 수정
**명령어**: `npm run format:fix`
**동작**:

- Prettier 규칙에 따라 코드 자동 포맷팅
  **사용 시점**: 커밋 전 코드 정리

### `preview: "vite preview"`

**설명**: 빌드 결과물 미리보기
**명령어**: `npm run preview`
**동작**:

- 빌드된 파일을 로컬 서버로 제공
- 프로덕션 환경 시뮬레이션
  **사용 시점**: 배포 전 최종 테스트

---

## 🤝 Peer Dependencies

```json
"peerDependencies": {
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "tailwindcss": "^4.0.0"
}
```

### Peer Dependencies란?

- 이 라이브러리를 사용하는 **호스트 애플리케이션이 제공해야 하는** 패키지
- 라이브러리 자체 번들에 포함되지 않음

### 왜 Peer Dependencies를 사용하는가?

1. **중복 방지**: 여러 버전의 React가 번들에 포함되는 것을 방지
2. **번들 크기 최적화**: 호스트 앱의 React를 재사용
3. **버전 호환성**: 라이브러리와 호스트 앱이 동일한 React 버전 사용 보장

### 각 패키지 설명

#### `react: "^19.0.0"`

- React 코어 라이브러리
- ^19.0.0 = 19.0.0 이상 20.0.0 미만
- **이유**: React 컴포넌트 라이브러리이므로 필수

#### `react-dom: "^19.0.0"`

- React를 DOM에 렌더링하는 패키지
- **이유**: 웹 애플리케이션에서 React 컴포넌트 사용 시 필수

#### `tailwindcss: "^4.0.0"`

- 유틸리티 퍼스트 CSS 프레임워크
- **이유**:
  - 모든 UI 컴포넌트가 Tailwind 클래스 사용
  - 호스트 앱에서 Tailwind 설정 공유 필요
  - 동적 클래스 생성 및 JIT 컴파일 지원

---

## 📦 Dependencies (일반 의존성)

### UI 및 스타일링

#### `@base-ui/react: "^1.1.0"`

**설명**: 접근성 기반 Headless UI 컴포넌트 라이브러리
**이유**:

- WAI-ARIA 표준 준수
- 스타일 자유도를 유지하면서 접근성 확보
- shadcn 스타일 컴포넌트의 기반

#### `@fontsource-variable/inter: "^5.2.8"`

**설명**: Inter 가변 폰트 (Self-hosted)
**이유**:

- Google Fonts CDN 의존성 제거
- GDPR 준수
- 오프라인 환경 지원
- 로딩 속도 개선

#### `@tailwindcss/vite: "^4.1.17"`

**설명**: Tailwind CSS v4의 Vite 플러그인
**이유**:

- Tailwind CSS v4와 Vite 통합
- 빠른 개발 서버 및 빌드
- JIT 모드 최적화

#### `class-variance-authority: "^0.7.1"` (CVA)

**설명**: 타입 안전한 컴포넌트 variants 관리
**사용 예시**:

```typescript
const button = cva('btn', {
	variants: {
		intent: { primary: 'btn-primary', secondary: 'btn-secondary' },
		size: { sm: 'btn-sm', lg: 'btn-lg' },
	},
});
```

**이유**:

- 조건부 클래스 로직 단순화
- TypeScript 타입 안정성
- Tailwind와 완벽한 통합

#### `clsx: "^2.1.1"`

**설명**: 조건부 클래스명 유틸리티
**사용 예시**:

```typescript
clsx('btn', { 'btn-active': isActive, 'btn-disabled': disabled });
```

**이유**:

- 동적 클래스 관리 간소화
- falsy 값 자동 필터링

#### `lucide-react: "^0.563.0"`

**설명**: 경량 아이콘 라이브러리 (React 컴포넌트)
**이유**:

- 트리 쉐이킹 지원 (필요한 아이콘만 번들)
- 일관된 디자인 시스템
- TypeScript 지원

#### `tailwind-merge: "^3.4.0"`

**설명**: Tailwind 클래스 충돌 해결 유틸리티
**사용 예시**:

```typescript
twMerge('px-2 py-1', 'p-4'); // 결과: 'p-4' (충돌 해결)
```

**이유**:

- 컴포넌트 props로 스타일 오버라이드 시 충돌 방지
- 우선순위 자동 해결

#### `tw-animate-css: "^1.4.0"`

**설명**: Tailwind용 애니메이션 유틸리티
**이유**:

- 간단한 CSS 애니메이션 적용
- Tailwind 클래스 형식으로 일관성 유지

### 프레임워크 및 라이브러리

#### `react: "^19.0.0"`

**설명**: React 프레임워크 (동시에 peerDependency)
**이유**:

- 개발/테스트 환경에서 필요
- peerDependency 경고 방지
- React 19 최신 기능 지원

#### `react-dom: "^19.0.0"`

**설명**: React DOM 렌더링 (동시에 peerDependency)
**이유**: 개발 서버 실행 시 필요

#### `tailwindcss: "^4.0.0"`

**설명**: Tailwind CSS v4 프레임워크 (동시에 peerDependency)
**이유**:

- 빌드 시 필요
- 개발 환경에서 필요
- Tailwind CSS v4의 새로운 엔진 및 성능 개선 지원

#### `zustand: "^5.0.11"`

**설명**: 경량 상태 관리 라이브러리
**이유**:

- Redux 대비 보일러플레이트 최소화
- React Context보다 성능 우수
- TypeScript 친화적
- 번들 크기 작음 (~1KB)
  **사용 예시**: 테마 관리(theme-store.ts)

#### `shadcn: "^3.8.2"`

**설명**: shadcn/ui 컴포넌트 시스템 CLI
**이유**:

- 복사/수정 가능한 컴포넌트 제공
- 높은 커스터마이징 자유도
- 프로젝트에 직접 소스 코드 포함

---

## 🛠️ Dev Dependencies (개발 의존성)

### 타입 정의

#### `@types/node: "^24.10.1"`

**설명**: Node.js API 타입 정의
**이유**:

- `import.meta.env` 등 Vite 환경 변수 타입 지원
- 빌드 스크립트에서 Node API 사용 시 타입 안정성

#### `@types/react: "^19.2.5"`

**설명**: React 타입 정의
**이유**:

- JSX 타입 체크
- React Hooks 타입 안정성
- 컴포넌트 props 타입 추론

#### `@types/react-dom: "^19.2.3"`

**설명**: React DOM 타입 정의
**이유**: ReactDOM API 타입 지원

### 빌드 도구

#### `@vitejs/plugin-react: "^5.1.1"`

**설명**: Vite의 React 플러그인
**기능**:

- Fast Refresh (HMR) 지원
- JSX 변환
- React 최적화
  **이유**: React 개발 환경 필수

#### `vite: "^7.2.4"`

**설명**: 차세대 프론트엔드 빌드 도구
**장점**:

- 초고속 개발 서버 (esbuild 기반)
- 빠른 HMR
- 최적화된 프로덕션 빌드 (Rollup 기반)
- ES 모듈 네이티브 지원
  **이유**:
- 빠른 개발 경험
- 라이브러리 빌드 최적화

#### `vite-plugin-dts: "^4.5.4"`

**설명**: Vite용 TypeScript 선언 파일(.d.ts) 생성 플러그인
**기능**:

- 자동으로 `.d.ts` 파일 생성
- `preserveModules`와 호환
- 타입 롤업 및 최적화 지원
- Source map 생성 (`.d.ts.map`)
  **이유**:
- TypeScript 라이브러리의 타입 정의 자동 생성
- 빌드 프로세스 단순화
- 소비자 프로젝트에서 완벽한 타입 지원
  **설정 위치**: `vite.config.ts`의 `dts()` 플러그인

#### `@module-federation/vite: "^1.11.0"`

**설명**: Vite용 Module Federation 플러그인
**기능**:

- Micro Frontend 아키텍처 지원
- 런타임 모듈 공유 및 동적 로딩
- 원격 컴포넌트 노출 (exposes)
- 의존성 공유 (shared)
  **이유**:
- 여러 애플리케이션 간 컴포넌트/라이브러리 공유
- 독립적인 배포 및 버전 관리
- 런타임 통합으로 번들 크기 최적화
  **설정 위치**: `vite.config.ts`의 `federation()` 플러그인
  **주요 설정**:

```typescript
federation({
	name: 'rm_mf_library',
	filename: 'rm-mf-library-entry.js',
	exposes: {
		'./components': './src/components/index.ts',
		'./hooks': './src/hooks/index.ts',
	},
	shared: {
		react: { singleton: true },
		'react-dom': { singleton: true },
	},
});
```

### 코드 품질

#### `eslint: "^9.39.1"`

**설명**: JavaScript/TypeScript 린터
**이유**:

- 코드 품질 및 일관성 유지
- 잠재적 버그 사전 발견
- 팀 코딩 컨벤션 강제

#### `@eslint/js: "^9.39.1"`

**설명**: ESLint의 JavaScript 권장 규칙
**이유**: 기본 린트 규칙 세트

#### `typescript-eslint: "^8.46.4"`

**설명**: TypeScript용 ESLint 플러그인
**이유**:

- TypeScript 코드 린팅
- 타입 관련 규칙 적용

#### `eslint-plugin-react: "^7.37.5"`

**설명**: React 전용 ESLint 규칙
**이유**:

- React 베스트 프랙티스 강제
- JSX 문법 검증

#### `eslint-plugin-react-hooks: "^7.0.1"`

**설명**: React Hooks 규칙 검증
**이유**:

- Hooks 규칙 강제 (의존성 배열 등)
- Hooks 사용 오류 방지

#### `eslint-plugin-react-refresh: "^0.4.24"`

**설명**: React Fast Refresh 규칙
**이유**: HMR 호환성 보장

#### `eslint-config-prettier: "^10.1.8"`

**설명**: ESLint와 Prettier 충돌 방지
**이유**:

- 포맷팅은 Prettier에 위임
- 린트 규칙과 포맷 규칙 분리

#### `prettier: "^3.8.1"`

**설명**: 코드 포매터
**이유**:

- 일관된 코드 스타일
- 자동 포맷팅으로 생산성 향상
- 코드 리뷰 시 스타일 논쟁 제거

#### `globals: "^16.5.0"`

**설명**: 전역 변수 정의 (ESLint용)
**이유**: 브라우저/Node.js 환경 전역 변수 인식

### TypeScript

#### `typescript: "~5.9.3"`

**설명**: TypeScript 컴파일러
**버전 전략**: `~5.9.3` = 5.9.3 이상 5.10.0 미만 (패치 버전만 업데이트)
**이유**:

- 타입 안정성
- 최신 JavaScript 기능 사용
- 컴파일 시점 오류 발견
- 더 나은 IDE 지원

### 유틸리티

#### `cross-env: "^10.1.0"`

**설명**: 크로스 플랫폼 환경 변수 설정
**사용 예시**: `cross-env NODE_ENV=production`
**이유**:

- Windows/Mac/Linux 호환성
- CI/CD 환경 통일

---

## 📋 버전 관리 전략 요약

### Caret (`^`) vs Tilde (`~`)

- **`^` (Caret)**: MINOR 버전까지 업데이트 허용
  - 예: `^19.0.0` → 19.x.x 허용
  - **대부분의 패키지에 사용**
  - 이유: 하위 호환성 유지하며 버그 수정 및 기능 개선 수용

- **`~` (Tilde)**: PATCH 버전만 업데이트 허용
  - 예: `~5.9.3` → 5.9.x만 허용
  - **TypeScript에만 사용**
  - 이유: TypeScript는 MINOR 업데이트에서도 동작 변경 가능성 있음

---

## 🎯 패키지 관리 체크리스트

### 새 패키지 추가 시

1. **일반 의존성 vs 개발 의존성 구분**
   - 런타임에 필요 → `dependencies`
   - 빌드/개발 시에만 필요 → `devDependencies`

2. **Peer Dependencies 고려**
   - 호스트 앱과 공유해야 하는가?
   - 중복 설치를 방지해야 하는가?

3. **번들 크기 확인**
   - 트리 쉐이킹 지원 여부
   - 대체 경량 패키지 검토

### 패키지 업데이트 시

1. **Breaking Changes 확인**
   - CHANGELOG 검토
   - 마이그레이션 가이드 확인

2. **호환성 테스트**
   - 빌드 성공 확인
   - 주요 기능 테스트

3. **버전 잠금**
   - package-lock.json 커밋
   - 팀원 간 동일 버전 사용 보장

---

## 🚨 주의사항

### 1. Peer Dependencies 경고

- 호스트 애플리케이션에서 이 라이브러리 설치 시 peer dependencies를 함께 설치해야 함
- 버전 불일치 시 런타임 오류 가능

### 2. 빌드 전 타입 체크 필수

- `build` 스크립트가 `tsc -b tsconfig.build.json`을 먼저 실행하므로 타입 오류 시 빌드 실패
- 타입 오류를 사전에 수정해야 함
- `vite-plugin-dts`가 모든 타입 파일(.d.ts) 자동 생성

### 3. Private 패키지

- `private: true` 설정으로 공개 배포 불가
- 조직 내부 레지스트리 사용 또는 Git 의존성으로 설치

### 4. Exports 필드 브라우저 호환성

- 구형 번들러는 exports 필드 미지원 가능
- 최소 Node.js 12.20+, Webpack 5+, Vite 2+ 필요

### 5. Module Federation 사용 시

- 호스트 애플리케이션에서 `rm-mf-library-entry.js` 파일을 정확히 참조해야 함
- `@module-federation/vite` 버전 호환성 확인 필요 (현재 Vite 7.2.4와 함께 사용)
- `--legacy-peer-deps` 플래그로 설치됨 (peer dependency 경고 무시)
- shared 설정에서 React, React-DOM을 singleton으로 설정하여 중복 방지

### 6. 타입 파일 생성

- 빌드 시 `.d.ts` 파일이 자동으로 생성됨
- 각 모듈별로 타입 파일이 생성 (`dist/components/index.d.ts` 등)
- Source map 파일(`.d.ts.map`)도 함께 생성되어 디버깅 지원
- `preserveModules: true` 설정으로 원본 폴더 구조 유지

---

## 📚 추가 자료

### 공식 문서

- [npm package.json 공식 문서](https://docs.npmjs.com/cli/v9/configuring-npm/package-json)
- [Exports 필드 가이드](https://nodejs.org/api/packages.html#exports)
- [Semantic Versioning](https://semver.org/)
- [Peer Dependencies 이해하기](https://nodejs.org/en/blog/npm/peer-dependencies)

### Module Federation

- [Module Federation 공식 문서](https://module-federation.io/)
- [@module-federation/vite GitHub](https://github.com/module-federation/vite)
- [Micro Frontend 아키텍처 가이드](https://micro-frontends.org/)

### TypeScript & Vite

- [vite-plugin-dts GitHub](https://github.com/qmhc/vite-plugin-dts)
- [TypeScript Declaration Files](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html)
- [Vite 라이브러리 모드](https://vitejs.dev/guide/build.html#library-mode)

---

**마지막 업데이트**: 2026-02-03  
**작성자**: 프로젝트 관리팀  
**버전**: 2.0.0  
**주요 변경사항**:

- vite-plugin-dts 추가 및 타입 파일 자동 생성 설정
- @module-federation/vite 추가 및 Micro Frontend 지원
- build 스크립트 명시적 설정 (tsconfig.build.json)
- 타입 파일 생성 프로세스 상세 설명 추가
