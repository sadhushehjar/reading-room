import next from "eslint-config-next";

/** eslint-config-next 16 ships a flat-config array as its default export. */
export default [
  ...next,
  { ignores: [".next/**", "out/**", "node_modules/**", "public/**"] },
];
