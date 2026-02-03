# Micro Frontend 라이브러리 패키지 구성 플랜

## 아키텍처 개요

![Micro Frontend Library Architecture](./mf-library-architecture.png)

**구조 설명:**

- **Library Package**: 6개의 핵심 모듈로 구성
  - Components (Shadcn/ui)
  - Hooks (Custom React Hooks)
  - Utils (Helper Functions)
  - Services (API Clients)
  - Store (State Management)
  - Types (TypeScript Definitions)
- **Distribution Methods**: 2가지 배포 방식 지원
  - NPM Package (npm install)
  - Module Federation (Runtime Loading)
- **Consumers**: 라이브러리를 사용하는 앱들
  - Host App (rm-mf-boilerplate-main)
  - Remote App 1
  - Remote App 2

## 1. 디렉토리 구조 재구성

현재 `src/core/components/shadcn` 중심 구조를 확장하여 완전한 라이브러리 구조로 변경:

```
src/
├── components/              # UI 컴포넌트 (기존 shadcn 이동)
│   ├── ui/                 # Shadcn UI 컴포넌트들
│   │   ├── alert-dialog.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── lib/
│   │   └── utils.ts        # cn 유틸리티
│   └── index.ts            # 컴포넌트 통합 export
│
├── hooks/                   # 공통 React Hooks
│   ├── use-media-query.ts
│   ├── use-local-storage.ts
│   ├── use-debounce.ts
│   └── index.ts
│
├── utils/                   # 유틸리티 함수
│   ├── format.ts           # 포맷팅 함수
│   ├── validation.ts       # 검증 함수
│   ├── date.ts            # 날짜 관련
│   └── index.ts
│
├── services/               # API 클라이언트
│   ├── api-client.ts      # Axios/Fetch 기본 설정
│   ├── auth-service.ts    # 인증 서비스
│   └── index.ts
│
├── store/                  # 상태 관리 (Zustand/Jotai)
│   ├── auth-store.ts      # 인증 상태
│   ├── theme-store.ts     # 테마 상태
│   └── index.ts
│
├── types/                  # TypeScript 타입 정의
│   ├── api.ts
│   ├── common.ts
│   └── index.ts
│
├── constants/              # 상수
│   ├── api.ts             # API 엔드포인트
│   ├── config.ts          # 설정값
│   └── index.ts
│
├── styles/                 # 스타일 관련
│   └── app.css            # Tailwind 기본 스타일
│
├── index.ts               # 메인 엔트리 포인트 (모든 것 export)
└── vite-env.d.ts
```

**주요 변경사항:**

- `src/core/components/shadcn` → `src/components`로 이동 및 단순화
- 6개의 핵심 모듈 영역 추가 (hooks, utils, services, store, types, constants)
- 각 모듈마다 `index.ts`로 통합 export

## 2. NPM 패키지 빌드 설정

### 2.1 Vite Library 모드 설정

[vite.config.ts](vite.config.ts) 수정:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import federation from '@module-federation/vite';
import path from 'path';
import { resolve } from 'path';

export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		federation({
			name: 'rm_mf_library',
			filename: 'remoteEntry.js',
			exposes: {
				'./components': './src/components/index.ts',
				'./hooks': './src/hooks/index.ts',
				'./utils': './src/utils/index.ts',
				'./services': './src/services/index.ts',
				'./store': './src/store/index.ts',
				'./types': './src/types/index.ts',
				'./constants': './src/constants/index.ts',
				'./styles': './src/styles/app.css',
			},
			shared: {
				react: { singleton: true, requiredVersion: '^19.0.0' },
				'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
				'lucide-react': { singleton: true },
				tailwindcss: { singleton: true },
			},
		}),
	],
	build: {
		lib: {
			entry: {
				index: resolve(__dirname, 'src/index.ts'),
				components: resolve(__dirname, 'src/components/index.ts'),
				hooks: resolve(__dirname, 'src/hooks/index.ts'),
				utils: resolve(__dirname, 'src/utils/index.ts'),
				services: resolve(__dirname, 'src/services/index.ts'),
				store: resolve(__dirname, 'src/store/index.ts'),
			},
			name: 'RmMfLibrary',
			formats: ['es', 'cjs'],
		},
		rollupOptions: {
			external: ['react', 'react-dom', 'react/jsx-runtime', 'lucide-react', '@base-ui/react'],
			output: {
				preserveModules: true,
				preserveModulesRoot: 'src',
				exports: 'named',
			},
		},
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
});
```

**핵심 포인트:**

- `federation` 플러그인으로 Module Federation 설정
- `build.lib` 설정으로 NPM 패키지 빌드
- 멀티 엔트리 포인트 (index, components, hooks 등)
- Tree-shaking을 위한 `preserveModules: true`

### 2.2 Package.json 설정

[package.json](package.json) 수정:

```json
{
	"name": "@rm/mf-boilerplate-library",
	"version": "0.1.0",
	"type": "module",
	"main": "./dist/index.cjs",
	"module": "./dist/index.js",
	"types": "./dist/index.d.ts",
	"exports": {
		".": {
			"import": "./dist/index.js",
			"require": "./dist/index.cjs",
			"types": "./dist/index.d.ts"
		},
		"./components": {
			"import": "./dist/components/index.js",
			"require": "./dist/components/index.cjs",
			"types": "./dist/components/index.d.ts"
		},
		"./hooks": {
			"import": "./dist/hooks/index.js",
			"require": "./dist/hooks/index.cjs",
			"types": "./dist/hooks/index.d.ts"
		},
		"./utils": {
			"import": "./dist/utils/index.js",
			"require": "./dist/utils/index.cjs",
			"types": "./dist/utils/index.d.ts"
		},
		"./services": {
			"import": "./dist/services/index.js",
			"require": "./dist/services/index.cjs",
			"types": "./dist/services/index.d.ts"
		},
		"./store": {
			"import": "./dist/store/index.js",
			"require": "./dist/store/index.cjs",
			"types": "./dist/store/index.d.ts"
		},
		"./styles": "./dist/styles/app.css"
	},
	"files": ["dist", "README.md"],
	"peerDependencies": {
		"react": "^19.0.0",
		"react-dom": "^19.0.0",
		"tailwindcss": "^4.0.0"
	},
	"dependencies": {
		"@base-ui/react": "^1.1.0",
		"class-variance-authority": "^0.7.1",
		"clsx": "^2.1.1",
		"lucide-react": "^0.563.0",
		"tailwind-merge": "^3.4.0",
		"zustand": "^5.0.2"
	},
	"devDependencies": {
		"@module-federation/vite": "^2.0.0",
		"@types/node": "^24.10.1",
		"@types/react": "^19.2.5",
		"@types/react-dom": "^19.2.3",
		"@vitejs/plugin-react": "^5.1.1",
		"vite": "^7.2.4",
		"typescript": "~5.9.3",
		"vite-plugin-dts": "^4.3.0"
	},
	"scripts": {
		"dev": "vite",
		"build": "tsc && vite build && npm run build:types",
		"build:types": "tsc --project tsconfig.build.json --declaration --emitDeclarationOnly --outDir dist",
		"preview": "vite preview"
	}
}
```

**핵심 포인트:**

- `exports` 필드로 서브패키지 경로 지원 (`@rm/mf-boilerplate-library/components`)
- `peerDependencies`로 React, TailwindCSS 의존성 관리
- `vite-plugin-dts`로 TypeScript 선언 파일 자동 생성

### 2.3 TypeScript 빌드 설정

`tsconfig.build.json` 신규 생성:

```json
{
	"extends": "./tsconfig.app.json",
	"compilerOptions": {
		"declaration": true,
		"declarationMap": true,
		"emitDeclarationOnly": true,
		"outDir": "./dist",
		"rootDir": "./src"
	},
	"include": ["src"],
	"exclude": ["src/**/*.test.ts", "src/**/*.test.tsx"]
}
```

## 3. Import 경로 수정

현재 일부 파일에서 잘못된 경로 사용 중:

- [src/core/components/shadcn/ui/field.tsx](src/core/components/shadcn/ui/field.tsx)
- [src/core/components/shadcn/ui/combobox.tsx](src/core/components/shadcn/ui/combobox.tsx)
- [src/core/components/shadcn/ui/input-group.tsx](src/core/components/shadcn/ui/input-group.tsx)

**수정 예시:**

```typescript
// 현재 (잘못됨)
import { Label } from '@/components/ui/label';

// 수정 후
import { Label } from '@/components/ui/label';
```

이동 후에는 경로가 일치하게 됩니다.

## 4. 모듈별 구현 가이드

### 4.1 Components 모듈

`src/components/index.ts`:

```typescript
// UI Components
export * from './ui/alert-dialog';
export * from './ui/badge';
export * from './ui/button';
export * from './ui/card';
export * from './ui/combobox';
export * from './ui/dropdown-menu';
export * from './ui/field';
export * from './ui/input-group';
export * from './ui/input';
export * from './ui/label';
export * from './ui/select';
export * from './ui/separator';
export * from './ui/textarea';

// Utils
export { cn } from './lib/utils';
```

### 4.2 Hooks 모듈

`src/hooks/index.ts` (신규):

```typescript
export { useMediaQuery } from './use-media-query';
export { useLocalStorage } from './use-local-storage';
export { useDebounce } from './use-debounce';
```

예시 Hook (`src/hooks/use-media-query.ts`):

```typescript
import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
	const [matches, setMatches] = useState(false);

	useEffect(() => {
		const media = window.matchMedia(query);
		setMatches(media.matches);

		const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
		media.addEventListener('change', listener);
		return () => media.removeEventListener('change', listener);
	}, [query]);

	return matches;
}
```

### 4.3 Utils 모듈

`src/utils/index.ts` (신규):

```typescript
export * from './format';
export * from './validation';
export * from './date';
```

### 4.4 Services 모듈

`src/services/api-client.ts` (신규):

```typescript
export interface ApiClientConfig {
	baseURL: string;
	timeout?: number;
	headers?: Record<string, string>;
}

export class ApiClient {
	private config: ApiClientConfig;

	constructor(config: ApiClientConfig) {
		this.config = config;
	}

	async get<T>(url: string): Promise<T> {
		// Fetch implementation
	}

	async post<T>(url: string, data: unknown): Promise<T> {
		// Fetch implementation
	}
}
```

### 4.5 Store 모듈 (Zustand)

`src/store/theme-store.ts` (신규):

```typescript
import { create } from 'zustand';

interface ThemeStore {
	theme: 'light' | 'dark';
	setTheme: (theme: 'light' | 'dark') => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
	theme: 'light',
	setTheme: (theme) => set({ theme }),
}));
```

## 5. 사용 방법 (Consumers에서)

### 5.1 NPM 패키지로 사용 (권장)

Host/Remote 앱의 `package.json`:

```json
{
	"dependencies": {
		"@rm/mf-boilerplate-library": "^0.1.0"
	}
}
```

사용 예시:

```typescript
// 전체 import
import { Button, Card, useMediaQuery, cn } from '@rm/mf-boilerplate-library';

// 서브패키지 import (Tree-shaking 최적화)
import { Button, Card } from '@rm/mf-boilerplate-library/components';
import { useMediaQuery } from '@rm/mf-boilerplate-library/hooks';
import { cn } from '@rm/mf-boilerplate-library/utils';
```

### 5.2 Module Federation으로 사용

Host 앱의 `vite.config.ts`:

```typescript
federation({
	name: 'host_app',
	remotes: {
		library: {
			type: 'module',
			name: 'rm_mf_library',
			entry: 'http://localhost:5001/remoteEntry.js',
		},
	},
	shared: {
		react: { singleton: true },
		'react-dom': { singleton: true },
	},
});
```

사용 예시:

```typescript
import { Button } from 'library/components';
import { useMediaQuery } from 'library/hooks';
```

## 6. 배포 전략

### 6.1 NPM 패키지 배포

```bash
# 빌드
npm run build

# 로컬 테스트
npm link

# Host/Remote 앱에서
npm link @rm/mf-boilerplate-library

# 실제 배포 (Private Registry 또는 npm)
npm publish
```

### 6.2 Module Federation 서빙

라이브러리를 개발 서버로 실행:

```bash
npm run dev  # http://localhost:5001
```

Host/Remote 앱에서 위 URL로 remoteEntry.js 참조

## 7. Components.json 업데이트

[components.json](components.json) 경로 수정:

```json
{
	"aliases": {
		"components": "@/components",
		"utils": "@/components/lib/utils",
		"ui": "@/components/ui",
		"lib": "@/components/lib",
		"hooks": "@/hooks"
	}
}
```

## 8. 프로젝트 정리

- `src/App.tsx`, `src/main.tsx`, `index.html`: 개발/테스트용으로 유지 (배포에서 제외)
- `src/core` 디렉토리 삭제 (재구성 후)
- `component-example.tsx`, `example.tsx`: 개발 참고용으로 유지하거나 제거

## 장점 요약

### NPM 패키지 방식

- ✅ 명확한 버전 관리
- ✅ 의존성 관리 용이
- ✅ 빌드 시간 최적화
- ✅ 타입 안정성 보장
- ✅ Tree-shaking 지원

### Module Federation 방식

- ✅ 런타임 동적 로딩
- ✅ 번들 크기 최적화
- ✅ 즉시 업데이트 반영
- ✅ 버전 충돌 방지

### 하이브리드 접근

- ✅ 두 방식의 장점 모두 활용
- ✅ 상황에 맞는 선택 가능
- ✅ 마이그레이션 유연성
