// jest.config.js
module.exports = {
    preset: "@vue/cli-plugin-unit-jest",
    transformIgnorePatterns: [
        "<rootDir>/node_modules/(?!@xlt-group)/dist"
    ],
    "moduleFileExtensions": [
        "js",
        "json",
        // 告诉 Jest 处理 `*.vue` 文件
        "vue"
    ],
    "transform": {
        // 用 `vue-jest` 处理 `*.vue` 文件
        "^.+\\.vue$": "vue-jest",
        "^.+\\.jsx?$": "babel-jest"
    },
    snapshotSerializers: ["jest-serializer-vue"],
    testMatch: [
        "**/tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)",
    ],
    setupFiles: [
        "./tests/unit/setup.js"
    ],
    reporters: [
        'default'
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['lcov', 'text', 'text-summary'],
    coveragePathIgnorePatterns: [
        'node_modules',
    ],
}
