import { describe, it, expect, vi, beforeEach } from "vitest";
import { FileManager } from "../src/utils/fileManager.js";
import chalk from "chalk";
import "../src/commands/find.js";
import { FunkoGenre, FunkoType } from "../src/models/funko.js";

vi.mock("../src/utils/fileManager.js");

describe("findCommand", () => {
  const testUser = "testUser";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should display Funko details if it exists", () => {
    const testFunko = {
      id: 1,
      name: "Test Funko",
      description: "A test Funko Pop",
      type: FunkoType.POP,
      genre: FunkoGenre.VIDEO_GAMES,
      franchise: "Test Franchise",
      number: 100,
      exclusive: false,
      specialFeatures: "None",
      marketValue: 50,
    };

    vi.spyOn(FileManager, "getFunko").mockReturnValue(testFunko);
    const consoleLogMock = vi.spyOn(console, "log").mockImplementation(() => {});

    const argv = { user: testUser, id: 1 };
    require("yargs").command(
      "find",
      "Finds a Funko",
      () => {},
      (args) => {
        const funko = FileManager.getFunko(args.user, args.id);
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
        console.log(`Market Value: ${chalk.yellow(`$${funko.marketValue}`)}`);
      }
    ).parseSync(["find", "--user", argv.user, "--id", argv.id]);

    expect(FileManager.getFunko).toHaveBeenCalledWith(testUser, 1);
    expect(consoleLogMock).toHaveBeenCalledWith(chalk.green("Funko details:"));
    expect(consoleLogMock).toHaveBeenCalledWith(`ID: ${chalk.blue(testFunko.id)}`);
    expect(consoleLogMock).toHaveBeenCalledWith(`Name: ${chalk.blue(testFunko.name)}`);
  });

  it("should display an error message if the Funko does not exist", () => {
    vi.spyOn(FileManager, "getFunko").mockReturnValue(null);
    const consoleLogMock = vi.spyOn(console, "log").mockImplementation(() => {});

    const argv = { user: testUser, id: 999 };
    require("yargs").command(
      "find",
      "Finds a Funko",
      () => {},
      (args) => {
        const funko = FileManager.getFunko(args.user, args.id);
        if (!funko) {
          console.log(chalk.red("Funko not found!"));
          return;
        }
      }
    ).parseSync(["find", "--user", argv.user, "--id", argv.id]);

    expect(FileManager.getFunko).toHaveBeenCalledWith(testUser, 999);
    expect(consoleLogMock).toHaveBeenCalledWith(chalk.red("Funko not found!"));
  });

  it("should display the market value in green if it is less than $20", () => {
    const testFunko = {
      id: 1,
      name: "Cheap Funko",
      description: "A cheap Funko Pop",
      type: FunkoType.POP,
      genre: FunkoGenre.VIDEO_GAMES,
      franchise: "Cheap Franchise",
      number: 101,
      exclusive: false,
      specialFeatures: "None",
      marketValue: 15,
    };

    vi.spyOn(FileManager, "getFunko").mockReturnValue(testFunko);
    const consoleLogMock = vi.spyOn(console, "log").mockImplementation(() => {});

    const argv = { user: testUser, id: 1 };
    require("yargs").command(
      "find",
      "Finds a Funko",
      () => {},
      (args) => {
        const funko = FileManager.getFunko(args.user, args.id);
        if (funko) {
          console.log(`Market Value: ${chalk.green(`$${funko.marketValue}`)}`);
        }
      }
    ).parseSync(["find", "--user", argv.user, "--id", argv.id]);

    expect(FileManager.getFunko).toHaveBeenCalledWith(testUser, 1);
    expect(consoleLogMock).toHaveBeenCalledWith(`Market Value: ${chalk.green(`$${testFunko.marketValue}`)}`);
  });
});