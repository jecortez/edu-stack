/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  cacheDirectory: './node_modules/.cache/remix',
  ignoredRouteFiles: [
    '**/.*',
    '**/*.css',
    '**/*.stories.{js,jsx,ts,tsx}',
    '**/*.test.{js,jsx,ts,tsx}',
  ],
  future: {
    unstable_cssModules: true,
    unstable_cssSideEffectImports: true,
  },
  serverDependenciesToBundle: [/^@chanzuckerberg\/eds/],
};
