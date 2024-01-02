// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

module.exports = {
  "*.{js,jsx,ts,tsx}": [
    (fileNames) =>
      `next lint --fix --file ${fileNames.map((fileName) => path.relative(process.cwd(), fileName)).join(" --file ")}`,
  ],
  "./**/*.{css,htm,html,js,jsx,json,md,mdx,scss,ts,tsx,yaml,yml}": ["prettier --write"],
  "./**/package.json": ["sort-package-json"],
};
