# TypeScript .d.ts 타입 파일 생성 가이드

본 문서는 TypeScript 라이브러리에서 타입 정의 파일(.d.ts)을 생성하는 방법과 본 프로젝트에서 선택한 방식에 대해 설명합니다.

---

## 🎯 타입 파일이란?

TypeScript 선언 파일(.d.ts)은 JavaScript 코드에 대한 타입 정보를 제공하는 파일입니다.

**역할**:

- 라이브러리 사용자에게 타입 정보 제공
- IDE 자동완성 지원
- 컴파일 타임 타입 체크
- "Go to Definition" 기능 지원

**예시**:

```typescript
// src/components/button.tsx
export interface ButtonProps {
  variant: 'primary' | 'secondary';
  onClick: () => void;
}

export const Button: React.FC<ButtonProps> = ({ variant, onClick }) => {
  return <button onClick={onClick}>{variant}</button>;
};

// ↓ 생성됨

// dist/components/button.d.ts
export interface ButtonProps {
  variant: 'primary' | 'secondary';
  onClick: () => void;
}

export const Button: React.FC<ButtonProps>;
```

---

## 📊 타입 파일 생성 방법 비교

### 방법 1: TypeScript 컴파일러 (tsc) ⭐ 선택됨

**개요**: TypeScript 공식 컴파일러를 직접 사용

**장점**:

- ✅ TypeScript 공식 표준 방법
- ✅ 추가 플러그인 설치 불필요
- ✅ 안정성과 호환성 보장
- ✅ 공식 문서와 커뮤니티 지원
- ✅ 명확한 역할 분리 (tsc=타입, Vite=JS)

**단점**:

- ⚠️ 빌드 스크립트가 2단계로 나뉨
- ⚠️ 빌드 시간 약간 증가

---

### 방법 2: vite-plugin-dts

**개요**: Vite 플러그인을 통한 타입 파일 생성

**장점**:

- ✅ Vite 빌드 중 자동 생성
- ✅ 한 번의 빌드 명령
- ✅ 편리한 설정

**단점**:

- ❌ 추가 패키지 설치 필요 (`vite-plugin-dts`)
- ❌ Vite 생태계 종속
- ❌ TypeScript 공식 방법이 아님
- ❌ 플러그인 버전 호환성 관리 필요
- ❌ 역할이 혼재됨 (Vite가 JS와 타입 모두 생성)

---

## ✅ 본 프로젝트의 선택: TypeScript 컴파일러 (tsc)

### 선택 이유

1. **표준성과 안정성**
   - TypeScript 공식 컴파일러 사용
   - 검증된 도구로 안정적인 빌드 보장
   - 향후 TypeScript 버전 업데이트 호환성 우수

2. **간결성**
   - 불필요한 플러그인 설치 제거
   - 의존성 최소화
   - package.json이 깔끔함

3. **명확한 역할 분리**

   ```
   Vite        → JavaScript 파일 생성 (.js)
   TypeScript  → 타입 파일 생성 (.d.ts)
   ```

4. **문서화와 지원**
   - TypeScript 공식 문서 참조 가능
   - 커뮤니티에서 널리 사용되는 방법
   - 팀원들이 이해하기 쉬움

---

## 🔧 설정 방법

### 1. package.json 설정

```json
{
	"scripts": {
		"build": "vite build && tsc -b tsconfig.build.json"
	},
	"devDependencies": {
		"typescript": "~5.9.3",
		"vite": "^7.2.4"
		// vite-plugin-dts는 설치하지 않음
	}
}
```

**빌드 순서가 중요**:

1. `vite build` → JavaScript 파일 먼저 생성
2. `tsc -b tsconfig.build.json` → 타입 파일 추가

> ⚠️ 순서를 바꾸면 Vite가 dist 폴더를 지워서 타입 파일이 사라집니다!

---

### 2. tsconfig.build.json 설정

```json
{
	"extends": "./tsconfig.app.json",
	"compilerOptions": {
		"noEmit": false, // 파일 생성 허용
		"declaration": true, // .d.ts 파일 생성
		"declarationMap": true, // .d.ts.map 생성 (디버깅용)
		"emitDeclarationOnly": true, // 타입 파일만 생성 (JS는 생성 안 함)
		"outDir": "./dist", // 출력 디렉토리
		"rootDir": "./src", // 소스 디렉토리
		"composite": false
	},
	"include": ["src"],
	"exclude": [
		"src/**/*.test.ts",
		"src/**/*.test.tsx",
		"src/**/*.spec.ts",
		"src/**/*.spec.tsx",
		"src/App.tsx",
		"src/main.tsx",
		"src/components/component-example.tsx",
		"src/components/example.tsx"
	]
}
```

**주요 옵션 설명**:

| 옵션                  | 값         | 설명                                                   |
| --------------------- | ---------- | ------------------------------------------------------ |
| `noEmit`              | `false`    | 파일 생성 허용 (tsconfig.app.json의 `true` 오버라이드) |
| `declaration`         | `true`     | .d.ts 파일 생성                                        |
| `declarationMap`      | `true`     | 소스맵 생성 (Go to Definition 지원)                    |
| `emitDeclarationOnly` | `true`     | **타입 파일만** 생성 (JS는 Vite가 생성)                |
| `outDir`              | `"./dist"` | Vite와 동일한 출력 폴더                                |
| `rootDir`             | `"./src"`  | 폴더 구조 유지                                         |

---

### 3. vite.config.ts 설정

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';

export default defineConfig({
  plugins: [
    react(),
    federation({...}),
    // vite-plugin-dts는 사용하지 않음
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'RmMfLibrary',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', ...],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
    },
  },
});
```

**중요**: `vite-plugin-dts` import와 사용을 제거했습니다.

---

## 🚀 빌드 프로세스

### 전체 흐름

```bash
npm run build
  ↓
1. vite build
   ├─ dist/ 폴더 생성 (또는 초기화)
   ├─ JavaScript 파일 생성 (.js)
   ├─ CSS 번들링
   └─ Module Federation 진입점 생성
  ↓
2. tsc -b tsconfig.build.json
   ├─ tsconfig.build.json 읽기
   ├─ src/ 폴더 타입 체크
   ├─ .d.ts 파일 생성
   └─ .d.ts.map 파일 생성
```

### 생성 결과

```
dist/
├── index.js                    ← Vite가 생성
├── index.d.ts                  ← tsc가 생성
├── index.d.ts.map              ← tsc가 생성
│
├── components/
│   ├── index.js                ← Vite가 생성
│   ├── index.d.ts              ← tsc가 생성
│   ├── index.d.ts.map          ← tsc가 생성
│   └── ui/
│       ├── button.js           ← Vite가 생성
│       ├── button.d.ts         ← tsc가 생성
│       └── button.d.ts.map     ← tsc가 생성
│
├── hooks/
│   ├── index.js
│   ├── index.d.ts
│   └── use-debounce.d.ts
│
└── rm-mf-library-entry.js      ← Module Federation 진입점
```

---

## 📝 개발 워크플로우

### 개발 중

```bash
npm run dev
```

- Vite 개발 서버만 실행
- 타입 체크는 수행하지만 파일 생성 안 함 (빠른 HMR)
- `tsconfig.app.json` 사용 (`noEmit: true`)

### 빌드 시

```bash
npm run build
```

- `vite build` + `tsc -b` 순차 실행
- JavaScript와 타입 파일 모두 생성
- `tsconfig.build.json` 사용

### 타입 체크만

```bash
npx tsc --noEmit
```

또는 별도 스크립트 추가:

```json
{
	"scripts": {
		"typecheck": "tsc --noEmit"
	}
}
```

---

## 🔍 문제 해결

### Q1: 타입 파일이 생성되지 않아요

**확인 사항**:

1. `tsconfig.build.json`에 `noEmit: false`가 있는지
2. 빌드 순서가 `vite build && tsc -b`인지 (순서 중요!)
3. `exclude`에 필요한 파일이 포함되어 있지 않은지

**해결**:

```bash
# 수동으로 타입 파일만 생성 테스트
npx tsc -b tsconfig.build.json --verbose
```

---

### Q2: Vite가 타입 파일을 지워버려요

**원인**: `vite build`가 먼저 실행되면 dist 폴더를 초기화합니다.

**해결**:

```json
// package.json - 순서를 지켜야 함!
{
	"scripts": {
		"build": "vite build && tsc -b tsconfig.build.json"
		// ✅ 올바른 순서: vite 먼저, tsc 나중
	}
}
```

---

### Q3: tsconfig.app.json의 noEmit이 방해해요

**원인**: `tsconfig.build.json`이 `tsconfig.app.json`을 상속받아 `noEmit: true`가 적용됩니다.

**해결**:

```json
// tsconfig.build.json
{
	"extends": "./tsconfig.app.json",
	"compilerOptions": {
		"noEmit": false, // ← 명시적으로 오버라이드
		"declaration": true
		// ...
	}
}
```

---

### Q4: 특정 파일의 타입이 생성되지 않아요

**원인**: `exclude`에 포함되어 있을 수 있습니다.

**확인**:

```json
// tsconfig.build.json
{
	"exclude": [
		"src/**/*.test.ts", // 테스트 파일
		"src/App.tsx", // 개발용 파일
		"src/main.tsx", // 진입점 파일
		"src/components/example.tsx" // 예제 파일
	]
}
```

**해결**: `exclude`에서 해당 패턴을 제거하거나 수정

---

## 🎨 다른 방식과의 비교

### 만약 vite-plugin-dts를 사용했다면?

**설치**:

```bash
npm install -D vite-plugin-dts
```

**설정**:

```typescript
// vite.config.ts
import dts from 'vite-plugin-dts';

export default defineConfig({
	plugins: [
		react(),
		dts({
			include: ['src/**/*.ts', 'src/**/*.tsx'],
			exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
			outDir: 'dist',
			insertTypesEntry: true,
			rollupTypes: true,
			tsconfigPath: './tsconfig.build.json',
		}),
	],
});
```

**빌드**:

```json
{
	"scripts": {
		"build": "vite build" // 한 번에 처리
	}
}
```

**왜 선택하지 않았는가?**

- 추가 패키지 의존성
- TypeScript 공식 방법이 아님
- 플러그인 버전 호환성 관리 필요
- 표준성과 간결성을 위해 tsc 선택

---

## 📚 추가 자료

### TypeScript 공식 문서

- [Declaration Files](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html)
- [Compiler Options](https://www.typescriptlang.org/tsconfig)
- [Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)

### 프로젝트 설정 파일

- `tsconfig.build.json` - 빌드 전용 TypeScript 설정
- `tsconfig.app.json` - 개발 환경 TypeScript 설정
- `package.json` - 빌드 스크립트 정의
- `vite.config.ts` - Vite 빌드 설정

---

## 🎯 체크리스트

빌드 설정을 올바르게 구성했는지 확인하세요:

- [ ] `package.json`에 `typescript` 패키지만 설치됨 (vite-plugin-dts 없음)
- [ ] 빌드 스크립트가 `"vite build && tsc -b tsconfig.build.json"` 순서
- [ ] `tsconfig.build.json`에 `noEmit: false` 설정됨
- [ ] `tsconfig.build.json`에 `declaration: true` 설정됨
- [ ] `tsconfig.build.json`에 `emitDeclarationOnly: true` 설정됨
- [ ] `vite.config.ts`에 `vite-plugin-dts` import가 없음
- [ ] 빌드 후 `dist/index.d.ts` 파일이 생성됨
- [ ] 빌드 후 `dist/components/index.d.ts` 파일이 생성됨

---

## 💡 결론

**선택**: TypeScript 컴파일러 (tsc) + tsconfig.build.json  
**이유**: 표준적이고, 간결하며, 안정적인 방법  
**결과**: 깔끔한 의존성과 명확한 빌드 프로세스

본 프로젝트는 TypeScript 공식 도구를 사용하여 **표준성과 간결성**을 우선시합니다.

---

**마지막 업데이트**: 2026-02-03  
**작성자**: 프로젝트 관리팀  
**버전**: 1.0.0
