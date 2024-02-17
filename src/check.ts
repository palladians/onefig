import uri from "fast-uri";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import packageSchema from "./schema/package.schema.json";
import eslintSchema from "./schema/eslintrc.schema.json";
import prettierSchema from "./schema/prettierrc.schema.json";
import tsconfigSchema from "./schema/tsconfig.schema.json";
import { getConfig } from "./config";

const ajv = new Ajv({
  uriResolver: uri,
  strictSchema: true,
  allowUnionTypes: true,
  allowMatchingProperties: true,
});
addFormats(ajv);

export const check = async () => {
  const parsedConfig = await getConfig();
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
