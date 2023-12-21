import typescript from '@rollup/plugin-typescript';

// Rollup Configuration
export default {
  input: ['index.ts', 'plugins/index.ts'],
  output: {
    dir: '../dist/fastify-decorators',
    format: 'cjs',
    sourcemap: 'inline',
    preserveModules: true,
    entryFileNames: () => '[name].cjs',
  },
  plugins: [typescript({ tsconfig: './tsconfig.lib.json', moduleResolution: 'Node' })],
  external: ['fastify', 'fastify-plugin', 'node:fs', 'node:fs/promises'],
  treeshake: false,
};
