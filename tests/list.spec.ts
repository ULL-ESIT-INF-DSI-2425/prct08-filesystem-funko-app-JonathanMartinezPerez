import { describe, it, expect, vi, beforeEach } from "vitest";
import { FileManager } from "../src/utils/fileManager.js";
import chalk from "chalk";
import "../src/commands/list.js";
import { FunkoGenre, FunkoType } from "../src/models/funko.js";

vi.mock("../src/utils/fileManager.js");

describe("listCommand", () => {
  const testUser = "testUser";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should list all Funkos for a user", () => {
    const funkos = [
      {
        id: 1,
        name: "Funko 1",
        description: "Description 1",
        type: FunkoType.POP,
        genre: FunkoGenre.VIDEO_GAMES,
        franchise: "Franchise 1",
        number: 101,
        exclusive: false,
        specialFeatures: "None",
        marketValue: 50,
      },
      {
        id: 2,
        name: "Funko 2",
        description: "Description 2",
        type: FunkoType.POP_RIDES,
        genre: FunkoGenre.MOVIES_TV,
        franchise: "Franchise 2",
        number: 102,
        exclusive: true,
        specialFeatures: "Glow in the dark",
        marketValue: 100,
      },
    ];

    vi.spyOn(FileManager, "loadFunkos").mockReturnValue(funkos);
    const consoleLogMock = vi.spyOn(console, "log").mockImplementation(() => {});

    const argv = { user: testUser };
    require("yargs").command(
      "list",
      "Lists all Funkos for a user",
      () => {},
      (args) => {
        const funkos = FileManager.loadFunkos(args.user);
        if (funkos.length === 0) {
          console.log(chalk.yellow("No Funkos found for this user."));
        } else {
          console.log(chalk.green(`Funkos for user ${args.user}:`));
          funkos.forEach((funko) => {
            console.log(JSON.stringify(funko, null, 2));
          });
        }
      }
    );
  });
});