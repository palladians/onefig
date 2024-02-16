import uri from "fast-uri";
import Ajv from "ajv";
import { findUp, pathExists, type Match } from "find-up";
import { load } from "js-toml";
import path from "path";
import addFormats from "ajv-formats";
import packageSchema from "./schema/package.schema.json";
import eslintSchema from "./schema/eslintrc.schema.json";
import prettierSchema from "./schema/prettierrc.schema.json";
import tsconfigSchema from "./schema/tsconfig.schema.json";

const ajv = new Ajv({
  uriResolver: uri,
  strictSchema: true,
  allowUnionTypes: true,
  allowMatchingProperties: true,
});
addFormats(ajv);

export const check = async () => {
  const configDir = await findUp(
    async (directory) => {
      const hasUnicorns = await pathExists(path.join(directory, "onefig.toml"));
      return (hasUnicorns && directory) as Match;
    },
    { type: "directory" },
  );
  if (!configDir) {
    console.error("No onefig.toml configuration file found.");
    return process.exit(1);
  }
  const parsedConfig = load(
    await Bun.file(path.join(configDir, "onefig.toml")).text(),
  );
  if (parsedConfig.package) {
    const validatePackage = ajv.compile(packageSchema);
    const valid = validatePackage(parsedConfig.package);
    if (!valid) {
      console.error("Package config is not valid", validatePackage.errors);
      return process.exit(1);
    }
  }
  if (parsedConfig.eslint) {
    const validateEslint = ajv.compile(eslintSchema);
    const valid = validateEslint(parsedConfig.eslint);
    if (!valid) {
      console.error("ESLint config is not valid", validateEslint.errors);
      return process.exit(1);
    }
  }
  if (parsedConfig.prettier) {
    const validatePrettier = ajv.compile(prettierSchema);
    const valid = validatePrettier(parsedConfig.prettier);
    if (!valid) {
      console.error("Prettier config is not valid", validateEslint.errors);
      return process.exit(1);
    }
  }
  if (parsedConfig.tsconfig) {
    const validateTsconfig = ajv.compile(tsconfigSchema);
    const valid = validateTsconfig(parsedConfig.tsconfig);
    if (!valid) {
      console.error("TS config is not valid", validateTsconfig.errors);
      return process.exit(1);
    }
  }
  console.info("No issues found");
};
