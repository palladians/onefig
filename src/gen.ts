import path from "path";
import { getConfig } from "./config";
import camelcaseKeys from "camelcase-keys";

const generateJsonConfig = ({
  filename,
  config,
  dir,
}: {
  filename: string;
  config: object;
  dir: string;
}) => {
  const stopPaths =
    filename === "package.json"
      ? ["dependencies", "devDependencies", "peerDependencies"]
      : [];
  // TODO: Add editorconfig fallback
  const tabWidth = config?.prettier?.tabWidth ?? 2;
  const camelCasedConfig = camelcaseKeys(config as Record<string, unknown>, {
    deep: true,
    stopPaths,
  });
  const configFileContent = JSON.stringify(
    camelCasedConfig,
    undefined,
    tabWidth,
  );
  return Bun.write(path.join(dir, filename), configFileContent);
};

export const gen = async () => {
  const { parsedConfig, configDir } = await getConfig();
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
