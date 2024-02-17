import { findUp, pathExists, type Match } from "find-up";
import { load } from "js-toml";
import path from "path";

export const getConfig = async () => {
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
  return { parsedConfig, configDir };
};
