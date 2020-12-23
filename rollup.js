import renameExtensions from '@betit/rollup-plugin-rename-extensions';
import typescript from '@rollup/plugin-typescript';

// Rollup Configuration
export default {
  input: ['lib/index.ts', 'lib/testing/index.ts'],
  output: {
    dir: 'dist/fastify-decorators',
    format: 'cjs',
    sourcemap: true,
  },
  preserveModules: true,
  plugins: [
    typescript({ tsconfig: './lib/tsconfig.lib.json' }),
    renameExtensions({
      include: ['**/*.ts'],
      mappings: {
        '.js': '.cjs',
      },
      sourcemap: true,
    }),
  ],
  external: ['fastify', 'fastify-plugin', 'fs', 'path', 'url'],
  treeshake: false,
};
