module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
    jest: true
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:@typescript-eslint/recommended"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.eslint.json"],
    sourceType: "module"
  },
  ignorePatterns: [
    "/lib/**/*",
    ".eslintrc.js"
  ],
  plugins: [
    "@typescript-eslint",
    "import"
  ],
  rules: {
    "@typescript-eslint/no-unused-vars": ["warn", { 
      "argsIgnorePattern": "^_",
      "varsIgnorePattern": "^_",
      "caughtErrorsIgnorePattern": "^_"
    }],
    "import/no-unresolved": 0
  },
  overrides: [
    {
      files: ["**/__tests__/**/*.ts"],
      rules: {
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-explicit-any": "off"
      }
    }
  ]
}; 