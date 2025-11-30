import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.browser } },
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
]);

module.exports = {
 env: {
   commonjs: true,
   es6: true,
   node: true
 },
 extends: "eslint:recommended",
 globals: {},
 parserOptions: {
   ecmaVersion: 2018
 },
 rules: {
   indent: [ "error", "tab" ],
   "linebreak-style": [ "error", "unix" ],
   quotes: [ "error", "double" ],
   semi: [ "error", "always" ],
   "array-bracket-spacing": [ "error", "always" ],
   "object-curly-spacing": [ "error", "always" ],
   "space-in-parens": [ "error", "always" ]
 }
};
