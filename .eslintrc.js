module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "rules": {
        "indent": [
            "error",
            4,
            { "SwitchCase": 1 }
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ],
        "array-bracket-spacing": [
            "error",
            "never",
            {
                "singleValue": true
            }
        ],
        "object-curly-spacing": [
            "error",
            "always"
        ],
        "quote-props": [
            "error",
            "as-needed"
        ],
        "eqeqeq": [
            "error",
            "always"
        ],
        "arrow-parens": [
            "error",
            "as-needed"
        ],
        "comma-dangle": [
            "error",
            "never"
        ],
        "space-in-parens": [
            "error",
            "never"
        ],
        "eol-last": [
            "error",
            "always"
        ],
        "no-multiple-empty-lines": [
            "error",
            {
                "max": 1,
                "maxBOF": 0,
                "maxEOF": 0
            }
        ],
        "one-var": [
            "error",
            "never"
        ],
        "max-len": [
            "error",
            115
        ],
        "max-depth": [
            "error",
            2
        ],
        "max-statements-per-line": [
            "error",
            { "max": 1 }
        ],
        "max-statements": [
            "error",
            30
        ],
        "max-params": [
            "error",
            4
        ],
        "complexity": [
            "error",
            10
        ],
        "no-plusplus": [
            "error",
            { "allowForLoopAfterthoughts": true }
        ],
        "camelcase": [
            "error",
            { "properties": "never"}
        ],
        "no-var": "error",
        "arrow-spacing": "error",
        "space-infix-ops": "error",
        "strict": "error",
        "no-bitwise": "error",
        "operator-linebreak": "error",
        "no-new": "error",
        "curly": "error",
        "no-eval": "error",
        "no-eq-null": "error",
        "vars-on-top": "error",
        "prefer-template": "error",
        "no-useless-concat": "error",
        "space-before-function-paren": "error",
        "default-case": "error",
        "no-case-declarations": "off",
        "no-trailing-spaces": "error",
        "no-multi-spaces": "error",
        "spaced-comment": "error",
        "comma-spacing": "error",
        "comma-style": "error",
        "no-unneeded-ternary": "error",
        "block-spacing": "error",
        "brace-style": "error",
        "key-spacing": "error",
        "keyword-spacing": "error",
        "no-nested-ternary": "error",
        "dot-notation": "error",
        "prefer-arrow-callback": "error",
        "guard-for-in": "error",
        "no-whitespace-before-property": "error"
    }
};
