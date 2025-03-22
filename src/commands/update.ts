import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { FileManager } from "../utils/fileManager.js";
import { Funko, FunkoType, FunkoGenre } from "../models/funko.js";
import chalk from "chalk";

/**
 * Comando de yargs que actualiza una figura Funko.
 */
export const updateCommand = yargs(hideBin(process.argv))
  .command(
    "update",
    "Updates a Funko",
    {
      user: { type: "string", demandOption: true },
      id: { type: "number", demandOption: true },
      name: { type: "string" },
      description: { type: "string" },
      type: { type: "string" },
      genre: { type: "string" },
      franchise: { type: "string" },
      number: { type: "number" },
      exclusive: { type: "boolean" },
      specialFeatures: { type: "string" },
      marketValue: { type: "number" },
    },
    (argv) => {
      const existingFunko = FileManager.getFunko(argv.user, argv.id);
      if (!existingFunko) {
        console.log(chalk.red("Funko not found!"));
        return;
      }

      const updatedFunko: Funko = {
        ...existingFunko,
        name: argv.name ?? existingFunko.name,
        description: argv.description ?? existingFunko.description,
        type: (argv.type as FunkoType) ?? existingFunko.type,
        genre: (argv.genre as FunkoGenre) ?? existingFunko.genre,
        franchise: argv.franchise ?? existingFunko.franchise,
        number: argv.number ?? existingFunko.number,
        exclusive: argv.exclusive ?? existingFunko.exclusive,
        specialFeatures: argv.specialFeatures ?? existingFunko.specialFeatures,
        marketValue: argv.marketValue ?? existingFunko.marketValue,
      };

      FileManager.saveFunko(argv.user, updatedFunko);
      console.log(chalk.green("Funko updated successfully!"));
    }
  )
  .help()
  .argv;