export default {
  extends: ['stylelint-config-standard'],
  ignoreFiles: ['dist/**', 'node_modules/**'],
  rules: {
    // Allow existing BEM-style modifier classes (e.g., .order-field--day)
    'selector-class-pattern': null,
    // Handled by Prettier / existing section formatting conventions
    'custom-property-empty-line-before': null,
    'rule-empty-line-before': null,
    'declaration-empty-line-before': null,
    // Component stylesheets intentionally override base/shared rules by cascade order
    'no-descending-specificity': null,
    // Keep legacy min-width/max-width media queries compatible across older browsers
    'media-feature-range-notation': null,
    // Preserve readable legacy rgba()/hex/font-family formatting across existing CSS
    'color-function-notation': null,
    'color-function-alias-notation': null,
    'alpha-value-notation': null,
    'color-hex-length': null,
    'font-family-name-quotes': null,
    'value-keyword-case': null,
    // Allow explicit vendor prefixes where needed for cross-browser compatibility
    'property-no-vendor-prefix': null,
    // Surface deprecated CSS as warnings so existing code isn't blocked while flagging tech debt
    'property-no-deprecated': [
      true,
      {
        severity: 'warning',
      },
    ],
    'declaration-property-value-keyword-no-deprecated': [
      true,
      {
        severity: 'warning',
      },
    ],
  },
};
