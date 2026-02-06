import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier/flat';

export default defineConfig([
  {
    ignores: ['node_modules/**', 'build/**', '.react-router/**']
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  eslintConfigPrettier
]);
