import { getConfig } from "./config";
import { $ } from "bun";

export const install = async () => {
  const { parsedConfig } = await getConfig();
  const packageManager = parsedConfig?.onefig?.package_manager ?? "npm";
  await $`${packageManager} install`;
};
