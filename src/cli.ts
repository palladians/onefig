import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { gen } from "./gen";
import { check } from "./check";

yargs(hideBin(process.argv))
  .command("gen", "Generates configuration file artifacts.", () => {}, gen)
  .command("check", "Validates configuration files.", () => {}, check)
  .parse();
