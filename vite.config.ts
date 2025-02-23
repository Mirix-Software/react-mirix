import path from 'path';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import svgr from 'vite-plugin-svgr';

interface ViteConfigInput {
	mode: string;
	command: string;
}

export default (args: ViteConfigInput) => {
	const isProd = args.mode === 'production';
	const prodPlugins = [react(), svgr({ svgrOptions: { icon: true } })];
	const devPlugins = [
		checker({
			overlay: {
				initialIsOpen: 'error',
				position: 'tr',
				panelStyle:
					'height: 100%; max-height: 100%; background-color: #32363f',
			},
			typescript: true,
			biome: {
				command: 'check',
				flags: '--apply',
				dev: {
					logLevel: ['error', 'warning'],
				},
			},
		}),
	];
	const plugins = isProd ? prodPlugins : [...prodPlugins, ...devPlugins];
	const generateScopedName = isProd
		? '[hash:base64:5]'
		: '[name]__[local]__[hash:base64:5]';

	return defineConfig({
		plugins,
		envDir: '..',
		css: {
			modules: {
				localsConvention: 'camelCase',
				generateScopedName,
			},
		},
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src'),
				'@app': path.resolve(__dirname, './src/app.tsx'),
				'@assets': path.resolve(__dirname, './src/assets'),
				'@components': path.resolve(__dirname, './src/components'),
				'@hooks': path.resolve(__dirname, './src/hooks'),
				'@models': path.resolve(__dirname, './src/models'),
				'@pages': path.resolve(__dirname, './src/pages'),
				'@store': path.resolve(__dirname, './src/store'),
				'@styles': path.resolve(__dirname, './src/styles'),
				'@utils': path.resolve(__dirname, './src/utils'),
			},
		},
	});
};
