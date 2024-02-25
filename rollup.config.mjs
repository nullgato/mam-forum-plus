import { defineExternal, definePlugins } from '@gera2ld/plaid-rollup'
import { defineConfig } from 'rollup'
import userscript from 'rollup-plugin-userscript'
import pkg from './package.json' assert { type: 'json' }

export default defineConfig(
    Object.entries({
        'mam-forum-redesign': 'src/index.ts',
        solid: 'src/lib/solid.ts',
    }).map(([name, entry]) => ({
        input: entry,
        plugins: [
            ...definePlugins({
                esm: true,
                minimize: false,
                postcss: {
                    inject: false,
                    minimize: true,
                },
                extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx'],
            }),
            userscript((meta) =>
                meta.replace('process.env.AUTHOR', pkg.author),
            ),
        ],
        external: defineExternal(['@violentmonkey/ui', '@violentmonkey/dom']),
        output: {
            name: name === 'solid' ? 'VM.solid' : 'AS',
            format: 'iife',
            file: `dist/${name}.user.js`,
            banner: `(async () => {`,
            footer: `})();`,
            globals: {
                '@violentmonkey/dom': 'VM',
                '@violentmonkey/ui': 'VM',
            },
            indent: false,
        },
    })),
)
