module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: ['alloy', "alloy/vue"],
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: {
            js: '@babel/eslint-parser',
            jsx: '@babel/eslint-parser',
            ts: '@typescript-eslint/parser',
            tsx: '@typescript-eslint/parser',
        },
    },
    rules: {
        // 函数参数最多4个
        'max-params': ['error', 4],

        'vue/no-duplicate-attr-inheritance': 'off',
        'vue/no-duplicate-attributes': [
            'error',
            {
                allowCoexistClass: true,
                allowCoexistStyle: true,
            },
        ],
        'no-irregular-whitespace': [
            1,
            {
                skipComments: true,
            },
        ],
    },
    overrides: [
        {
            files: [
                '**/__tests__/*.{j,t}s?(x)',
                '**/tests/unit/**/*.spec.{j,t}s?(x)'
            ],
            env: {
                jest: true
            }
        }
    ]
};
