import TypescriptPlugin from "@rollup/plugin-typescript";
import RenameExtensionsPlugin from "@betit/rollup-plugin-rename-extensions";


// Rollup Configuration
export default {
    input:["index.ts", "testing/index.ts"],
    output:{
        dir:"../dist/fastify-decorators",
        format:"cjs",
        sourcemap:"inline",
        entryFileNames:"[name].cjs",
        chunkFileNames:"[name]-[hash].cjs",
    },
    treeshake:false,
    preserveModules:true,
    plugins:[
        TypescriptPlugin({ 
            tsconfig:"./tsconfig.lib.json",
        }),
        (RenameExtensionsPlugin.default||RenameExtensionsPlugin)({
            include:["**/*.ts"],
            mappings:{
                ".js":".cjs",
            },
            sourcemap:"inline",
        }),
    ],
    external:["fastify","fastify-plugin","fs","path","url"],
};
