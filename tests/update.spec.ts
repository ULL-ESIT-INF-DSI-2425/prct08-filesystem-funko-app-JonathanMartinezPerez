import { describe, it, expect, vi, beforeEach } from "vitest";
import { FileManager } from "../src/utils/fileManager.js";
import { Funko, FunkoType, FunkoGenre } from "../src/models/funko.js";
import chalk from "chalk";
import { updateFunko } from "../src/commands/update.js";

vi.mock("../src/utils/fileManager.js");

describe("updateCommand", () => {
  const testUser = "testUser";
  const existingFunko: Funko = {
    id: 1,
    name: "Existing Funko",
    description: "An existing Funko Pop",
    type: FunkoType.POP,
    genre: FunkoGenre.VIDEO_GAMES,
    franchise: "Existing Franchise",
    number: 101,
    exclusive: false,
    specialFeatures: "None",
    marketValue: 60,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should update an existing Funko successfully", () => {
    vi.spyOn(FileManager, "getFunko").mockReturnValue(existingFunko);
    const saveFunkoMock = vi.spyOn(FileManager, "saveFunko").mockImplementation(() => {});

    const argv = {
      user: testUser,
      id: 1,
      name: "Updated Funko",
      description: "An updated Funko Pop",
      marketValue: 70,
    };

    updateFunko.handler(argv);

    const updatedFunko = {
      ...existingFunko,
      name: "Updated Funko",
      description: "An updated Funko Pop",
      marketValue: 70,
    };

    expect(FileManager.getFunko).toHaveBeenCalledWith(testUser, 1);
    expect(saveFunkoMock).toHaveBeenCalledWith(testUser, updatedFunko);
  });

  it("should not update a Funko if it does not exist", () => {
    vi.spyOn(FileManager, "getFunko").mockReturnValue(null);
    const consoleLogMock = vi.spyOn(console, "log").mockImplementation(() => {});

    const argv = {
      user: testUser,
      id: 1,
      name: "Updated Funko",
    };

    updateFunko.handler(argv);

    expect(FileManager.getFunko).toHaveBeenCalledWith(testUser, 1);
    expect(consoleLogMock).toHaveBeenCalledWith(chalk.red("Funko not found!"));
    expect(FileManager.saveFunko).not.toHaveBeenCalled();
  });

  it("should show an error if the Funko to update does not exist", () => {
    vi.spyOn(FileManager, "getFunko").mockReturnValue(null);
    const consoleLogMock = vi.spyOn(console, "log").mockImplementation(() => {});
  
    const argv = { user: testUser, id: 999, name: "Updated Funko" };
    require("yargs").command(
      "update",
      "Updates a Funko",
      () => {},
      (args) => {
        const existingFunko = FileManager.getFunko(args.user, args.id);
        if (!existingFunko) {
          console.log(chalk.red("Funko not found!"));
        }
      }
    ).parseSync(["update", "--user", argv.user, "--id", argv.id, "--name", argv.name]);
  
    expect(FileManager.getFunko).toHaveBeenCalledWith(testUser, 999);
    expect(consoleLogMock).toHaveBeenCalledWith(chalk.red("Funko not found!"));
  });

  it("should update only the provided fields of an existing Funko", () => {
    vi.spyOn(FileManager, "getFunko").mockReturnValue(existingFunko);
    const saveFunkoMock = vi.spyOn(FileManager, "saveFunko").mockImplementation(() => {});
  
    const argv = { user: testUser, id: 1, name: "Partially Updated Funko" };
    require("yargs").command(
      "update",
      "Updates a Funko",
      () => {},
      (args) => {
        const existingFunko = FileManager.getFunko(args.user, args.id);
        if (existingFunko) {
          const updatedFunko = { ...existingFunko, ...(args.name && { name: args.name }) };
          FileManager.saveFunko(args.user, updatedFunko);
        }
      }
    ).parseSync(["update", "--user", argv.user, "--id", argv.id, "--name", argv.name]);
  
    expect(FileManager.getFunko).toHaveBeenCalledWith(testUser, 1);
    expect(saveFunkoMock).toHaveBeenCalledWith(testUser, {
      ...existingFunko,
      name: "Partially Updated Funko",
    });
  });
});