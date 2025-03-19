import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import "./commands/add.js";

/** 
 * Yargs para gestionar todos los comandos.
 */
yargs(hideBin(process.argv)).help().argv;