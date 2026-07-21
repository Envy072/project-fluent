const nest = require('@project-fluent/config-eslint/nest.js');

module.exports = [
  // Prisma's generated client is auto-generated, third-party-style code —
  // never hand-edited and never linted.
  { ignores: ['generated/**'] },
  ...nest,
];
