const {defineConfig} = require('@vue/cli-service')

module.exports = defineConfig({
    transpileDependencies: true,
    css: {
        extract: false
    },
    configureWebpack: {
        optimization: {
            usedExports: true
        }
    },
    chainWebpack: (config) => {
        let vueRule = config.module.rule('vue')
        vueRule
            .use('js-conditional-compile-loader')
            .loader('js-conditional-compile-loader')
            .tap(() => {
                return {
                    noStreet: process.env.NO_STREET === 'yes',
                }
            }).end()
    }
})
