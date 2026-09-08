import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jsxA11y from "eslint-plugin-jsx-a11y";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // AODA commits us to WCAG 2.0 AA. eslint-config-next enables only six
  // jsx-a11y rules; the recommended set is thirty-four. Lint catches the
  // static violations, `npm run check:contrast` covers colour, and neither
  // substitutes for testing with a screen reader.
  //
  // Take the rules only, not the plugin block: eslint-config-next has already
  // registered the jsx-a11y plugin, and redefining it is a config error.
  {
    files: ["app/**/*.{jsx,tsx}", "components/**/*.{jsx,tsx}"],
    rules: jsxA11y.flatConfigs.recommended.rules,
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Embedded DevEnvTemplate doctor. Linted by its own config.
    ".devenv/**",
  ]),
]);

export default eslintConfig;
