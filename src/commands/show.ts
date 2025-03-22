import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { FileManager } from "../utils/fileManager.js";
import chalk from "chalk";

/**
 * Comando de yargs que muestra la información de un Funko específico.
 */
export const showCommand = yargs(hideBin(process.argv))
  .command(
    "show",
    "Shows details of a specific Funko",
    {
      user: { type: "string", demandOption: true },
      id: { type: "number", demandOption: true },
    },
    (argv) => {
      const funko = FileManager.getFunko(argv.user, argv.id);

      if (!funko) {
        console.log(chalk.red("Funko not found!"));
        return;
      }

      console.log(chalk.green("Funko details:"));
      console.log(`ID: ${chalk.blue(funko.id)}`);
      console.log(`Name: ${chalk.blue(funko.name)}`);
      console.log(`Description: ${chalk.blue(funko.description)}`);
      console.log(`Type: ${chalk.blue(funko.type)}`);
      console.log(`Genre: ${chalk.blue(funko.genre)}`);
      console.log(`Franchise: ${chalk.blue(funko.franchise)}`);
      console.log(`Number: ${chalk.blue(funko.number)}`);
      console.log(`Exclusive: ${chalk.blue(funko.exclusive ? "Yes" : "No")}`);
      console.log(`Special Features: ${chalk.blue(funko.specialFeatures)}`);

      // Mostrar el valor de mercado con colores según su valor
      if (funko.marketValue < 20) {
        console.log(`Market Value: ${chalk.green(`$${funko.marketValue}`)}`);
      } else if (funko.marketValue >= 20 && funko.marketValue <= 50) {
        console.log(`Market Value: ${chalk.yellow(`$${funko.marketValue}`)}`);
      } else {
        console.log(`Market Value: ${chalk.red(`$${funko.marketValue}`)}`);
      }
    }
  )
  .help()
  .argv;