// Fallback config for any file outside apps/web and apps/api (each of which
// has its own eslint.config.js) — primarily the shared config packages
// themselves, which are plain CommonJS Node files.
module.exports = require('@project-fluent/config-eslint/base.js');
