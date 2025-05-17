const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    devServer: {
        proxy: {
            '/acapi': {
                target: 'https://scnet-demo.accloud.cn',
                changeOrigin: true,
                pathRewrite: {
                    '^/acapi': '', // 去掉 /acapi 前缀，直接请求目标接口路径
                },
            },
            '/api': {
                target: 'https://api.scnet.cn',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/api' // 根据实际路径调整
                }
            }
        }
    }
})
