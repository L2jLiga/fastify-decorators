import renameExtensions from '@betit/rollup-plugin-rename-extensions';
import typescript from '@rollup/plugin-typescript';

// Rollup Configuration
export default {
  input: ['src/index.ts'],
  output: {
    dir: './dist',
    format: 'cjs',
    sourcemap: 'inline',
    preserveModules: true,
  },
  plugins: [
    typescript({ tsconfig: './tsconfig.lib.json' }),
    renameExtensions.default({
      include: ['**/*.ts'],
      mappings: {
        '.js': '.cjs',
      },
      sourcemap: 'inline',
    }),
  ],
  external: ['fastify-decorators/plugins', 'reflect-metadata'],
  treeshake: false,
};
