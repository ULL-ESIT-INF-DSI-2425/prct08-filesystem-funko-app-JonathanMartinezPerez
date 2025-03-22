import { describe, it, expect, vi, beforeEach } from "vitest";
import { FileManager } from "../src/utils/fileManager.js";
import chalk from "chalk";
import "../src/commands/delete.js";

vi.mock("../src/utils/fileManager.js");

describe("deleteCommand", () => {
  const testUser = "testUser";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should delete an existing Funko successfully", () => {
    vi.spyOn(FileManager, "deleteFunko").mockReturnValue(true);
    const consoleLogMock = vi.spyOn(console, "log").mockImplementation(() => {});

    const argv = { user: testUser, id: 1 };
    require("yargs").command(
      "delete",
      "Deletes a Funko",
      () => {},
      (args) => {
        const success = FileManager.deleteFunko(args.user, args.id);
        if (success) {
          console.log(chalk.green("Funko deleted successfully!"));
        } else {
          console.log(chalk.red("Funko not found!"));
        }
      }
    ).parseSync(["delete", "--user", argv.user, "--id", argv.id]);

    expect(FileManager.deleteFunko).toHaveBeenCalledWith(testUser, 1);
    expect(consoleLogMock).toHaveBeenCalledWith(chalk.green("Funko deleted successfully!"));
  });

  it("should not delete a Funko if it does not exist", () => {
    vi.spyOn(FileManager, "deleteFunko").mockReturnValue(false);
    const consoleLogMock = vi.spyOn(console, "log").mockImplementation(() => {});

    const argv = { user: testUser, id: 999 };
    require("yargs").command(
      "delete",
      "Deletes a Funko",
      () => {},
      (args) => {
        const success = FileManager.deleteFunko(args.user, args.id);
        if (success) {
          console.log(chalk.green("Funko deleted successfully!"));
        } else {
          console.log(chalk.red("Funko not found!"));
        }
      }
    ).parseSync(["delete", "--user", argv.user, "--id", argv.id]);

    expect(FileManager.deleteFunko).toHaveBeenCalledWith(testUser, 999);
    expect(consoleLogMock).toHaveBeenCalledWith(chalk.red("Funko not found!"));
  });

  it("should show an error if the Funko to delete does not exist", () => {
    vi.spyOn(FileManager, "deleteFunko").mockReturnValue(false);
    const consoleLogMock = vi.spyOn(console, "log").mockImplementation(() => {});
  
    const argv = { user: testUser, id: 999 };
    require("yargs").command(
      "delete",
      "Deletes a Funko",
      () => {},
      (args) => {
        const success = FileManager.deleteFunko(args.user, args.id);
        if (!success) {
          console.log(chalk.red("Funko not found!"));
        }
      }
    ).parseSync(["delete", "--user", argv.user, "--id", argv.id]);
  
    expect(FileManager.deleteFunko).toHaveBeenCalledWith(testUser, 999);
    expect(consoleLogMock).toHaveBeenCalledWith(chalk.red("Funko not found!"));
  });
});