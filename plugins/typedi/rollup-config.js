import typescript from '@rollup/plugin-typescript';

// Rollup Configuration
export default {
  input: ['src/index.ts'],
  output: {
    dir: './dist',
    format: 'cjs',
    sourcemap: 'inline',
    preserveModules: true,
    entryFileNames: () => '[name].cjs',
  },
  plugins: [typescript({ tsconfig: './tsconfig.lib.json', moduleResolution: 'Node' })],
  external: ['fastify-decorators/plugins', 'reflect-metadata'],
  treeshake: false,
};
