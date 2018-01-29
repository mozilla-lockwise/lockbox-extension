const defaultSeverity = (process.env.STRICT_LINT !== "1") ? "warning" : "error";

module.exports = {
  defaultSeverity,
  extends: "stylelint-config-recommended",
  rules: {
    "font-family-no-missing-generic-family-keyword": null,
    "no-descending-specificity": null,
  },
};
