import renameExtensions from '@betit/rollup-plugin-rename-extensions';
import typescript from '@rollup/plugin-typescript';

// Rollup Configuration
export default {
  input: ['index.ts', 'plugins/index.ts', 'testing/index.ts'],
  output: {
    dir: '../dist/fastify-decorators',
    format: 'cjs',
    sourcemap: 'inline',
  },
  preserveModules: true,
  plugins: [
    typescript({ tsconfig: './tsconfig.lib.json' }),
    renameExtensions({
      include: ['**/*.ts'],
      mappings: {
        '.js': '.cjs',
      },
      sourcemap: 'inline',
    }),
  ],
  external: ['fastify', 'fastify-plugin', 'fs', 'path', 'url'],
  treeshake: false,
};
