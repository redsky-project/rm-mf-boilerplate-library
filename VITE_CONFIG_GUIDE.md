# Vite Configuration 가이드

이 문서는 `rm-mf-boilerplate-library` 프로젝트의 `vite.config.ts` 파일에 대한 상세 가이드입니다. 각 설정 옵션의 목적과 사용 이유를 설명합니다.

---

## 📋 목차

1. [전체 구조 개요](#전체-구조-개요)
2. [임포트 (Imports)](#임포트-imports)
3. [플러그인 설정 (Plugins)](#플러그인-설정-plugins)
4. [빌드 설정 (Build)](#빌드-설정-build)
5. [Resolve 설정](#resolve-설정)
6. [주의사항 및 모범 사례](#주의사항-및-모범-사례)

---

## 전체 구조 개요

```typescript
export default defineConfig({
  plugins: [...],      // Vite 플러그인 설정
  build: {...},        // 빌드 옵션 설정
  resolve: {...},      // 경로 해석 설정
});
```

이 프로젝트는 **Module Federation**을 활용한 **공유 라이브러리**로 설계되어 있으며, 다른 Micro Frontend 애플리케이션에서 재사용 가능한 컴포넌트, 훅, 유틸리티를 제공합니다.

---

## 임포트 (Imports)

```typescript
import path from 'path';
import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { federation } from '@module-federation/vite';
```

### 각 임포트의 역할

| 임포트         | 용도                                                  |
| -------------- | ----------------------------------------------------- |
| `path`         | 경로 해석 및 조작 (alias 설정에 사용)                 |
| `resolve`      | 절대 경로 생성 (빌드 엔트리 포인트 지정)              |
| `tailwindcss`  | Tailwind CSS v4 지원을 위한 Vite 플러그인             |
| `react`        | React Fast Refresh 및 JSX 변환 지원                   |
| `defineConfig` | Vite 설정에 TypeScript 타입 안전성 제공               |
| `federation`   | Module Federation 설정 (마이크로 프론트엔드 아키텍처) |

---

## 플러그인 설정 (Plugins)

```typescript
plugins: [
  react(),
  tailwindcss(),
  federation({...}),
],
```

### 1. React 플러그인

```typescript
react();
```

**목적:**

- React JSX/TSX 파일 변환
- Fast Refresh (HMR) 지원으로 개발 중 빠른 피드백 제공
- React 19 지원

**설정 이유:**

- React 기반 컴포넌트 라이브러리이므로 필수
- 개발 생산성 향상

---

### 2. Tailwind CSS 플러그인

```typescript
tailwindcss();
```

**목적:**

- Tailwind CSS v4 통합
- CSS 처리 및 최적화
- 개발 서버에서 즉각적인 스타일 업데이트

**설정 이유:**

- 유틸리티 우선 CSS 프레임워크 사용
- 컴포넌트 라이브러리의 스타일링 일관성 유지
- `components.json`과 연동하여 shadcn/ui 스타일 시스템 적용

**참고:**

- Tailwind CSS v4는 기존 PostCSS 기반과 다른 새로운 Vite 플러그인 방식 사용
- `@tailwindcss/vite` 패키지를 통해 더 빠른 빌드 성능 제공

---

### 3. Module Federation 플러그인

```typescript
federation({
  name: 'RmMfLibrary',
  filename: 'rm-mf-library-entry.js',
  exposes: {...},
  shared: {...},
})
```

#### 3.1 기본 설정

##### `name: 'RmMfLibrary'`

**목적:**

- Module Federation의 고유 식별자
- 다른 애플리케이션에서 이 라이브러리를 참조할 때 사용

**설정 이유:**

- 명확한 네이밍 규칙 (rm = remote module, mf = module federation)
- 충돌 방지를 위한 고유한 이름

**사용 예시:**

```javascript
// 소비자 애플리케이션에서
remotes: {
  'rm_mf_library': 'http://localhost:5000/rm-mf-library-entry.js'
}
```

##### `filename: 'rm-mf-library-entry.js'`

**목적:**

- Module Federation 엔트리 파일명 지정
- 원격 모듈의 진입점 역할

**설정 이유:**

- 명확하고 설명적인 파일명 사용
- 다른 애플리케이션에서 로드할 때 쉽게 식별 가능

---

#### 3.2 Exposes 설정

```typescript
exposes: {
  './components': './src/components/index.ts',
  './hooks': './src/hooks/index.ts',
  './utils': './src/utils/index.ts',
  './services': './src/services/index.ts',
  './store': './src/store/index.ts',
  './types': './src/types/index.ts',
  './constants': './src/constants/index.ts',
  './styles': './src/styles/app.css',
}
```

**목적:**

- 외부에 노출할 모듈 정의
- 각 기능 영역을 독립적으로 임포트 가능하게 구성

**각 항목 설명:**

| 키             | 경로                        | 설명                          | 사용 예시                                                |
| -------------- | --------------------------- | ----------------------------- | -------------------------------------------------------- |
| `./components` | `./src/components/index.ts` | 재사용 가능한 UI 컴포넌트     | `import { Button } from 'rm_mf_library/components'`      |
| `./hooks`      | `./src/hooks/index.ts`      | React 커스텀 훅               | `import { useDebounce } from 'rm_mf_library/hooks'`      |
| `./utils`      | `./src/utils/index.ts`      | 유틸리티 함수                 | `import { formatDate } from 'rm_mf_library/utils'`       |
| `./services`   | `./src/services/index.ts`   | API 클라이언트 서비스         | `import { apiClient } from 'rm_mf_library/services'`     |
| `./store`      | `./src/store/index.ts`      | Zustand 상태 관리 스토어      | `import { useThemeStore } from 'rm_mf_library/store'`    |
| `./types`      | `./src/types/index.ts`      | TypeScript 타입 정의          | `import type { ApiResponse } from 'rm_mf_library/types'` |
| `./constants`  | `./src/constants/index.ts`  | 애플리케이션 상수             | `import { API_CONFIG } from 'rm_mf_library/constants'`   |
| `./styles`     | `./src/styles/app.css`      | 글로벌 스타일 및 Tailwind CSS | `import 'rm_mf_library/styles'`                          |

**설정 이유:**

- **관심사 분리**: 각 기능 영역을 명확히 구분
- **선택적 로딩**: 필요한 모듈만 로드하여 번들 크기 최적화
- **트리 쉐이킹**: 사용하지 않는 코드 자동 제거
- **명확한 API**: 라이브러리 사용자에게 직관적인 임포트 경로 제공

**주의사항:**

- 각 `index.ts` 파일에서 명시적으로 export된 항목만 사용 가능
- 내부 구현 세부사항은 노출되지 않음 (캡슐화)

---

#### 3.3 Shared 설정

```typescript
shared: {
  react: { singleton: true, requiredVersion: '^19.0.0' },
  'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
  'lucide-react': { singleton: true },
  tailwindcss: { singleton: true },
}
```

**목적:**

- 여러 마이크로 프론트엔드 간 공유 의존성 관리
- 중복 로딩 방지 및 메모리 효율성 향상

**각 옵션 설명:**

##### `react` & `react-dom`

```typescript
react: { singleton: true, requiredVersion: '^19.0.0' }
```

**옵션 상세:**

- `singleton: true`: 애플리케이션 전체에서 하나의 인스턴스만 사용
- `requiredVersion: '^19.0.0'`: 호환 가능한 최소 버전 지정

**설정 이유:**

- **Critical**: React는 반드시 싱글톤이어야 함
  - 여러 React 인스턴스가 존재하면 Hooks 에러 발생
  - Context API가 정상 작동하지 않음
- **버전 호환성**: React 19의 새로운 기능 활용 (Actions, use API 등)
- **성능**: 중복 로딩 방지로 초기 로딩 시간 단축

**주의사항:**

- 호스트 애플리케이션과 라이브러리의 React 버전이 호환되어야 함
- 버전 불일치 시 런타임 에러 발생 가능

##### `lucide-react`

```typescript
'lucide-react': { singleton: true }
```

**설정 이유:**

- 아이콘 라이브러리 중복 로딩 방지
- UI 컴포넌트에서 광범위하게 사용
- 번들 크기 절약 (lucide-react는 상대적으로 큰 라이브러리)

**효과:**

- 약 100-200KB의 번들 크기 절약 가능
- 여러 애플리케이션에서 동일한 아이콘 스타일 일관성 유지

##### `tailwindcss`

```typescript
tailwindcss: {
	singleton: true;
}
```

**설정 이유:**

- CSS 유틸리티 클래스의 일관성 보장
- 스타일 충돌 방지
- 중복 CSS 번들 방지

**효과:**

- 전역 CSS 스타일의 충돌 방지
- 동일한 Tailwind 설정 공유

---

## 빌드 설정 (Build)

```typescript
build: {
  lib: {...},
  rollupOptions: {...},
}
```

### 1. Library 모드 설정

```typescript
lib: {
  entry: resolve(__dirname, 'src/index.ts'),
  name: 'RmMfLibrary',
  formats: ['es'],
}
```

#### `entry: resolve(__dirname, 'src/index.ts')`

**목적:**

- 라이브러리의 진입점 지정
- 빌드 시작점 정의

**설정 이유:**

- `src/index.ts`에서 모든 export를 집중 관리
- 절대 경로 사용으로 환경에 무관하게 안정적인 빌드

**참고:**

- `src/index.ts`는 barrel export 패턴 사용
- 라이브러리의 공개 API 정의

#### `name: 'RmMfLibrary'`

**목적:**

- UMD/IIFE 빌드 시 전역 변수명 지정
- (현재는 ES 모듈만 사용하므로 직접적인 영향 없음)

**설정 이유:**

- 명확한 네이밍 (PascalCase 사용)
- 향후 다른 모듈 포맷 지원 시 대비

#### `formats: ['es']`

**목적:**

- 빌드 출력 형식 지정
- ES 모듈 포맷만 생성

**설정 이유:**

- **ES 모듈 사용 이유:**
  - 트리 쉐이킹 지원 (사용하지 않는 코드 제거)
  - 현대적인 번들러와 호환성 최고
  - 정적 분석 가능 (타입 체킹, 린팅)
  - Module Federation과 완벽한 호환
- **다른 포맷 미사용 이유:**
  - `cjs` (CommonJS): 레거시 형식, 트리 쉐이킹 불가
  - `umd`: 불필요한 wrapper 코드 추가, 크기 증가
  - `iife`: 독립 실행형 스크립트에만 필요

**효과:**

- 최소한의 번들 크기
- 최적의 성능

---

### 2. Rollup 옵션

```typescript
rollupOptions: {
  external: [...],
  output: {...},
}
```

#### 2.1 External 설정

```typescript
external: [
	'react',
	'react-dom',
	'react/jsx-runtime',
	'lucide-react',
	'@base-ui/react',
	/^@base-ui\/react\/.+$/,
	'zustand',
];
```

**목적:**

- 번들에 포함하지 않을 외부 의존성 지정
- 피어 의존성 처리

**각 항목 설명:**

| 의존성                    | 설정 이유                                           |
| ------------------------- | --------------------------------------------------- |
| `react`, `react-dom`      | 호스트 앱에서 제공하는 React 사용 (peer dependency) |
| `react/jsx-runtime`       | JSX 변환 런타임, React와 함께 제공                  |
| `lucide-react`            | 아이콘 라이브러리, 호스트 앱과 공유                 |
| `@base-ui/react`          | Base UI 메인 패키지, shadcn 기반                    |
| `/^@base-ui\/react\/.+$/` | Base UI 하위 패키지 전체 (정규식)                   |
| `zustand`                 | 상태 관리 라이브러리, 호스트 앱과 공유              |

**설정 이유:**

- **번들 크기 감소**: 외부 의존성을 번들에 포함하지 않아 크기 최소화
- **버전 충돌 방지**: 호스트 앱의 의존성 버전 사용
- **메모리 효율**: 동일한 라이브러리를 여러 번 로드하지 않음
- **빠른 업데이트**: 의존성 업데이트 시 라이브러리 재빌드 불필요

**정규식 사용 이유:**

```typescript
/^@base-ui\/react\/.+$/;
```

- `@base-ui/react/Button`, `@base-ui/react/Input` 등 모든 하위 패키지 매칭
- 개별적으로 나열할 필요 없음
- 새로운 Base UI 컴포넌트 추가 시 자동 처리

**주의사항:**

- `package.json`의 `peerDependencies`와 일치해야 함
- 호스트 앱에서 이 의존성들을 설치해야 함

---

#### 2.2 Output 설정

```typescript
output: {
  preserveModules: true,
  preserveModulesRoot: 'src',
  exports: 'named',
  entryFileNames: '[name].js',
}
```

##### `preserveModules: true`

**목적:**

- 원본 파일 구조 유지
- 단일 번들 대신 개별 모듈로 출력

**설정 이유:**

- **트리 쉐이킹 최적화**: 사용자가 필요한 모듈만 임포트 가능
- **디버깅 용이**: 원본 파일 구조와 동일하여 소스맵 추적 쉬움
- **점진적 로딩**: 필요한 모듈만 로드하여 초기 로딩 시간 단축
- **캐싱 효율**: 변경된 모듈만 재로드

**예시:**

```
dist/
  components/
    Button.js
    Card.js
  hooks/
    useDebounce.js
  utils/
    format.js
```

**비교:**

- `preserveModules: false`: 모든 코드를 하나의 파일로 번들링
- `preserveModules: true`: 개별 파일로 유지

##### `preserveModulesRoot: 'src'`

**목적:**

- 출력 디렉토리의 루트 경로 지정
- `src/` 접두사 제거

**설정 이유:**

- **깔끔한 경로**: `dist/src/components/Button.js` → `dist/components/Button.js`
- **일관성**: 사용자가 임포트할 때 직관적인 경로 제공
- **프로젝트 구조 반영**: 소스 구조를 그대로 dist에 반영

**효과:**

```typescript
// 사용자 측에서
import { Button } from 'rm_mf_library/components'; // ✅ 직관적
// 대신
import { Button } from 'rm_mf_library/src/components'; // ❌ 혼란스러움
```

##### `exports: 'named'`

**목적:**

- Named Export 방식 사용 지정

**설정 이유:**

- **명시적 임포트**: 어떤 함수/컴포넌트를 임포트하는지 명확
- **트리 쉐이킹**: 사용하지 않는 export 제거 가능
- **타입 안전성**: TypeScript에서 자동 완성 지원

**예시:**

```typescript
// Named Export (채택)
export { Button, Card, Input };
import { Button } from 'library'; // ✅

// Default Export (미사용)
export default { Button, Card, Input };
import library from 'library'; // ❌
```

**장점:**

- IDE 자동 완성 지원
- 명확한 의존성 추적
- 리팩토링 용이

##### `entryFileNames: '[name].js'`

**목적:**

- 출력 파일명 패턴 지정

**설정 이유:**

- **단순한 파일명**: 해시나 청크 ID 없이 원본 이름 유지
- **예측 가능**: `Button.tsx` → `Button.js`
- **디버깅 용이**: 파일명으로 즉시 식별 가능

**패턴 설명:**

- `[name]`: 원본 파일명 사용
- `.js`: 확장자 (ES 모듈)

**대안 패턴 (미사용 이유):**

- `[name].[hash].js`: 라이브러리에는 불필요한 복잡성
- `[name].min.js`: 프로덕션 빌드에서 자동 최적화

---

## Resolve 설정

```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
}
```

### Alias 설정

**목적:**

- 절대 경로 임포트 지원
- 상대 경로 지옥 (../../..) 방지

**설정 이유:**

- **가독성 향상**: 임포트 경로가 명확하고 간결
- **리팩토링 용이**: 파일 이동 시 임포트 경로 자동 조정
- **일관성**: 프로젝트 전체에서 동일한 임포트 방식 사용

**사용 예시:**

```typescript
// Before (상대 경로)
import { Button } from '../../../components/ui/button';
import { formatDate } from '../../utils/date';

// After (절대 경로)
import { Button } from '@/components/ui/button';
import { formatDate } from '@/utils/date';
```

**장점:**

- 코드 이동 시 임포트 경로 깨지지 않음
- 파일 위치에 관계없이 동일한 방식으로 임포트
- 타입스크립트 `paths` 설정과 일치 (`tsconfig.json`)

**연동 파일:**

```json
// tsconfig.json
{
	"compilerOptions": {
		"paths": {
			"@/*": ["./src/*"]
		}
	}
}
```

---

## 주의사항 및 모범 사례

### ⚠️ 주의사항

#### 1. React 버전 호환성

```typescript
// vite.config.ts
shared: {
  react: { singleton: true, requiredVersion: '^19.0.0' },
}
```

- 호스트 앱의 React 버전이 `^19.0.0`과 호환되어야 함
- 버전 불일치 시 런타임 에러 발생
- 개발/프로덕션 환경 모두 확인 필요

#### 2. External 의존성 관리

- `external`에 추가한 패키지는 반드시 `peerDependencies`에도 명시
- 호스트 앱에서 이 의존성들을 설치해야 함
- 누락 시 `Cannot find module` 에러 발생

#### 3. Module Federation 이름 충돌

```typescript
name: 'rm_mf_library';
```

- 다른 원격 모듈과 이름이 중복되지 않도록 주의
- 명명 규칙 준수 (프로젝트별 prefix 사용)

#### 4. Exposes 경로 관리

- `exposes`에 추가한 경로는 반드시 실제 파일이 존재해야 함
- `index.ts` 파일에서 명시적으로 export 필요
- 내부 구현 세부사항은 노출하지 않기

---

### ✅ 모범 사례

#### 1. 점진적 마이그레이션

새로운 모듈을 추가할 때:

```typescript
// 1. 소스 파일 생성
// src/features/index.ts

// 2. vite.config.ts에 추가
exposes: {
  './features': './src/features/index.ts',
}

// 3. package.json 타입 정의 추가
"exports": {
  "./features": {
    "types": "./dist/features/index.d.ts",
    "import": "./dist/features/index.js"
  }
}
```

#### 2. 의존성 업데이트

의존성을 업데이트할 때:

1. `package.json`에서 버전 업데이트
2. `vite.config.ts`의 `requiredVersion` 확인
3. 호스트 앱의 호환성 테스트
4. CHANGELOG 문서화

#### 3. 빌드 검증

빌드 후 확인 사항:

```bash
# 빌드 실행
npm run build

# 출력 구조 확인
ls -R dist/

# 타입 정의 확인
ls -R dist/**/*.d.ts

# 번들 크기 분석
npm run build -- --mode production
```

#### 4. 성능 최적화

- `preserveModules: true`로 트리 쉐이킹 활용
- 큰 의존성은 `external`로 분리
- 동적 임포트로 코드 스플리팅:

```typescript
// 지연 로딩
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

#### 5. 개발 워크플로우

```bash
# 개발 서버 (HMR 활성화)
npm run dev

# 타입 체크
npm run type-check

# 빌드 테스트
npm run build

# 로컬 테스트
npm link
# 호스트 앱에서: npm link rm-mf-boilerplate-library
```

---

## 🔗 관련 문서

- **[PACKAGE_JSON_GUIDE.md](./PACKAGE_JSON_GUIDE.md)**: package.json 설정 가이드
- **[TYPESCRIPT_DTS_GUIDE.md](./TYPESCRIPT_DTS_GUIDE.md)**: TypeScript 타입 정의 가이드
- **[ARCHITECTURE_PLAN.md](./public/ARCHITECTURE_PLAN.md)**: 전체 아키텍처 설계
- **[README.md](./README.md)**: 프로젝트 개요 및 사용법

---

## 📞 문의 및 지원

설정 관련 질문이나 문제가 있다면:

1. 관련 문서 먼저 확인
2. 에러 메시지 및 설정 파일 확인
3. 팀 채널 또는 이슈 트래커에 문의

---

**마지막 업데이트:** 2026-02-03  
**작성자:** Development Team  
**버전:** 1.0.0
