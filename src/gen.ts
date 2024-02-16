import { findUp, pathExists, type Match } from "find-up";
import { load } from "js-toml";
import path from "path";

const generateJsonConfig = ({
  filename,
  config,
  dir,
}: {
  filename: string;
  config: object;
  dir: string;
}) => {
  // TODO: Add editorconfig fallback
  const tabWidth = config?.prettier?.tabWidth ?? 2;
  const configFileContent = JSON.stringify(config, undefined, tabWidth);
  return Bun.write(path.join(dir, filename), configFileContent);
};

export const gen = async () => {
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
    await generateJsonConfig({
      filename: "package.json",
      config: parsedConfig.package,
      dir: configDir,
    });
    console.info("package.json was generated.");
  }
  if (parsedConfig.tsconfig) {
    await generateJsonConfig({
      filename: "tsconfig.json",
      config: parsedConfig.tsconfig,
      dir: configDir,
    });
    console.info("tsconfig.json was generated.");
  }
  if (parsedConfig.eslint) {
    await generateJsonConfig({
      filename: ".eslintrc.json",
      config: parsedConfig.eslint,
      dir: configDir,
    });
    console.info(".eslintrc.json was generated.");
  }
  if (parsedConfig.prettier) {
    await generateJsonConfig({
      filename: ".prettierrc.json",
      config: parsedConfig.prettier,
      dir: configDir,
    });
    console.info(".prettierrc.json was generated.");
  }
};
