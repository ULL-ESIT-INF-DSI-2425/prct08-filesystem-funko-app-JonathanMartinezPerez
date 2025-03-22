import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { FileManager } from "../utils/fileManager.js";
import { Funko, FunkoType, FunkoGenre } from "../models/funko.js";
import chalk from "chalk";

export const updateFunko = {
  handler: (argv: {
    user: string;
    id: number;
    name?: string;
    description?: string;
    type?: string;
    genre?: string;
    franchise?: string;
    number?: number;
    exclusive?: boolean;
    specialFeatures?: string;
    marketValue?: number;
  }) => {
    const existingFunko = FileManager.getFunko(argv.user, argv.id);

    if (!existingFunko) {
      console.log(chalk.red("Funko not found!"));
      return;
    }

    // Crear un nuevo objeto Funko con los datos actualizados
    const updatedFunko: Funko = {
      ...existingFunko, // Mantener valores anteriores
      ...(argv.name && { name: argv.name }),
      ...(argv.description && { description: argv.description }),
      ...(argv.type && { type: argv.type as FunkoType }),
      ...(argv.genre && { genre: argv.genre as FunkoGenre }),
      ...(argv.franchise && { franchise: argv.franchise }),
      ...(argv.number && { number: argv.number }),
      ...(argv.exclusive !== undefined && { exclusive: argv.exclusive }),
      ...(argv.specialFeatures && { specialFeatures: argv.specialFeatures }),
      ...(argv.marketValue && { marketValue: argv.marketValue }),
    };

    FileManager.saveFunko(argv.user, updatedFunko);
    console.log(chalk.green("Funko updated successfully!"));
  },
};
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

      // Crear un nuevo objeto Funko con los datos actualizados
      const updatedFunko: Funko = {
        ...existingFunko, // Mantener valores anteriores
        ...(argv.name && { name: argv.name }),
        ...(argv.description && { description: argv.description }),
        ...(argv.type && { type: argv.type as FunkoType }),
        ...(argv.genre && { genre: argv.genre as FunkoGenre }),
        ...(argv.franchise && { franchise: argv.franchise }),
        ...(argv.number && { number: argv.number }),
        ...(argv.exclusive !== undefined && { exclusive: argv.exclusive }),
        ...(argv.specialFeatures && { specialFeatures: argv.specialFeatures }),
        ...(argv.marketValue && { marketValue: argv.marketValue }),
      };

      FileManager.saveFunko(argv.user, updatedFunko);
      console.log(chalk.green("Funko updated successfully!"));
    }
  )
  .help()
  .argv;
