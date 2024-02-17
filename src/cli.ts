import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { gen } from "./gen";
import { check } from "./check";
import { add } from "./add";
import { install } from "./install";

yargs(hideBin(process.argv))
  .command("gen", "Generates configuration file artifacts.", () => {}, gen)
  .command("check", "Validates configuration files.", () => {}, check)
  .command(
    "install",
    "Installs dependencies with specified package manager.",
    () => {},
    install,
  )
  .command(
    "add <name>",
    "Adds package with specified package manager.",
    (yargs) =>
      yargs.positional("name", { description: "a package name to install" }),
    add,
  )
  .command("g", '"gen" shorthand.', () => {}, gen)
  .command("c", '"check" shorthand.', () => {}, check)
  .command("i", '"install" shorthand.', () => {}, install)
  .command(
    "a <name>",
    '"add" shorthand.',
    (yargs) =>
      yargs.positional("name", { description: "a package name to install" }),
    add,
  )
  .parse();
