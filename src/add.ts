import { getConfig } from "./config";
import { $ } from "bun";

export const add = async ({ name }: { name: string }) => {
  const { parsedConfig } = await getConfig();
  const packageManager = parsedConfig?.onefig?.package_manager ?? "npm";
  await $`${packageManager} add ${name}`;
};
