import babel from 'rollup-plugin-babel';
import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import injectProcessEnv from 'rollup-plugin-inject-process-env';
import jscc from 'rollup-plugin-jscc';
import sourcemap from 'rollup-plugin-sourcemaps'; 

const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js'
	},
	plugins: [
		//sourcemap(),
		jscc({
			values:{
				_DEV: !production,
				_PNPCONFIG: process.env.pnpconfig,
				_SPVER: process.env.spver ? process.env.spver : 0
			}
		}),

		svelte({
			//customElement: true,
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file - better for performance
			css: css => {
				css.write('public/build/bundle.css');
			}
		}),

		
		

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		
		commonjs(),
		 // compile to good old IE11 compatible ES5
		 babel(
			{
				extensions: [ '.js', '.mjs', '.html', '.svelte' ],
				runtimeHelpers: true,
				sourceMaps: true,
				inputSourceMap: true,
				exclude: [ 'node_modules/core-js/**' ],
				presets: [
					[
						'@babel/preset-env',
						{
						 	targets: '> 0.25%, IE 10',
						 	useBuiltIns: 'usage',
							corejs: 3
						}
					]
				],
				plugins: [
				'@babel/plugin-syntax-dynamic-import',
					[
						'@babel/plugin-transform-runtime',
						{
							useESModules: true
						}
					]
				]
		  	}
		),
		injectProcessEnv({ 
			NODE_ENV: production ? 'production' : 'development',
		}),
		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),
		
		
		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};

function serve() {
	let started = false;

	return {
		writeBundle() {
			if (!started) {
				started = true;

				require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
					stdio: ['ignore', 'inherit', 'inherit'],
					shell: true
				});
			}
		}
	};
}
