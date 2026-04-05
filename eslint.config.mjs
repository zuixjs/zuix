import globals from "globals";

export default [
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.es6,
                zuix: "writable"
            }
        },
        rules: {
            // Regole importate dal tuo vecchio .eslintrc.json
            "max-len": [1, { "code": 160, "comments": 200 }],
            "comma-dangle": ["error", "never"],
            "camelcase": 1,
            "no-unused-vars": 1,
            "no-undef": "error",
            "no-extend-native": 1,
            "prefer-spread": 1,
            "prefer-rest-params": 1,
            "no-invalid-this": "off",

            // DISABILITIAMO le nuove regole "fastidiose" introdotte da ESLint 9
            // che causano gli errori che vedi ora
            "no-useless-escape": "off",       // Toglie: Unnecessary escape character
            "no-case-declarations": "off",    // Toglie: Unexpected lexical declaration in case block
            "no-empty": "off",                // Toglie: Empty block statement
            "no-prototype-builtins": "off",   // Toglie: Do not access Object.prototype...
            "no-extra-boolean-cast": "off",   // Toglie: Unnecessary boolean conversion
            "no-cond-assign": "off",          // Toglie: Expected a conditional expression and instead saw an assignment
            "no-console": "off",              // Se vuoi permettere console.log
            "no-undef": "error"               // Manteniamo solo questo per sicurezza
        }
    }
];
