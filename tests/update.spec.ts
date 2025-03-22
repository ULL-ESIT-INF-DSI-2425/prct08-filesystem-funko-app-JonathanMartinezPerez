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
});