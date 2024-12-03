module.exports = {
  env: {
    node: true,
    es2021: true,
    commonjs: true,
  },
  extends: ["eslint:recommended"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "no-unused-vars": "warn",
    "no-console": "off",
    "import/no-unresolved": "off",
    "import/extensions": "off",
    "import/no-case-sensitive": "off",
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
};
