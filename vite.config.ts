import path from 'path';
import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { federation } from '@module-federation/vite';
// import dts from 'vite-plugin-dts';

// https://vite.dev/config/
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
		// dts({
		// 	include: ['src'],
		// 	outDir: 'dist',
		// 	insertTypesEntry: true,
		// }),
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
			formats: ['es'],
		},
		rollupOptions: {
			external: [
				'react',
				'react-dom',
				'react/jsx-runtime',
				'lucide-react',
				'@base-ui/react',
				/^@base-ui\/react\/.+$/,
				'zustand',
			],
			output: {
				preserveModules: true,
				preserveModulesRoot: 'src',
				exports: 'named',
				entryFileNames: '[name].js',
			},
		},
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
});
