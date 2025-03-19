import { describe, it, expect, vi, beforeEach } from "vitest";
import { addFunko } from "../src/commands/add.js";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const addCommand = yargs(hideBin(process.argv))
  .command(
    "add",
    "Add a new Funko",
    (yargs) => {
      return yargs
        .option("user", { type: "string", demandOption: true })
        .option("id", { type: "number", demandOption: true })
        .option("name", { type: "string", demandOption: true })
        .option("description", { type: "string", demandOption: true })
        .option("type", { type: "string", demandOption: true })
        .option("genre", { type: "string", demandOption: true })
        .option("franchise", { type: "string", demandOption: true })
        .option("number", { type: "number", demandOption: true })
        .option("exclusive", { type: "boolean", demandOption: true })
        .option("specialFeatures", { type: "string", demandOption: true })
        .option("marketValue", { type: "number", demandOption: true });
    },
    (argv) => {
      console.log("Command executed with:", argv);
    }
  )
  .help();
import { FileManager } from "../src/utils/fileManager.js";
import { Funko, FunkoType, FunkoGenre } from "../src/models/funko.js";
import chalk from "chalk";

// filepath: src/commands/add.test.ts

vi.mock("../utils/fileManager.js");

describe("addFunko", () => {
  const testUser = "testUser";
  const testFunko: Funko = {
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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should add a new Funko successfully", () => {
    vi.spyOn(FileManager, "getFunko").mockReturnValue(null);
    const saveFunkoMock = vi.spyOn(FileManager, "saveFunko").mockImplementation(() => {});

    addFunko(testUser, testFunko);

    expect(FileManager.getFunko).toHaveBeenCalledWith(testUser, testFunko.id);
    expect(saveFunkoMock).toHaveBeenCalledWith(testUser, testFunko);
  });

  it("should throw an error if the Funko ID already exists", () => {
    vi.spyOn(FileManager, "getFunko").mockReturnValue(testFunko);

    expect(() => addFunko(testUser, testFunko)).toThrowError(`El Funko con ID ${testFunko.id} ya existe.`);
    expect(FileManager.getFunko).toHaveBeenCalledWith(testUser, testFunko.id);
    expect(FileManager.saveFunko).not.toHaveBeenCalled();
  });
});

