const common = `features/**/*.feature --require tests/steps.ts --require-module ts-node/register --format progress-bar --format json:test-results/cucumber-report.json`;

module.exports = {
  default: common,
  ci: `${common} --publish`,
};
