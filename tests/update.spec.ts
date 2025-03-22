import { describe, it, expect, vi } from "vitest";
import { FileManager } from "../src/utils/fileManager.js";
import { Funko, FunkoType, FunkoGenre } from "../src/models/funko.js";
import { getUpdatedFunko } from "../src/commands/update.js";

vi.mock("../src/utils/fileManager.js");

describe("getUpdatedFunko", () => {
  it("should return null if the Funko does not exist", () => {
    vi.spyOn(FileManager, "getFunko").mockReturnValue(null);

    const result = getUpdatedFunko("user1", 1, { name: "Updated Name" });

    expect(result).toBeNull();
  });

  it("should return the updated Funko if it exists", () => {
    const existingFunko: Funko = {
      id: 1,
      name: "Original Name",
      description: "Original Description",
      type: FunkoType.POP,
      genre: FunkoGenre.ANIMATION,
      franchise: "Original Franchise",
      number: 1,
      exclusive: false,
      specialFeatures: "None",
      marketValue: 10,
    };

    vi.spyOn(FileManager, "getFunko").mockReturnValue(existingFunko);

    const updates = { name: "Updated Name", marketValue: 20 };
    const result = getUpdatedFunko("user1", 1, updates);

    expect(result).toEqual({
      ...existingFunko,
      name: "Updated Name",
      marketValue: 20,
    });
  });

  it("should not update fields that are not provided", () => {
    const existingFunko: Funko = {
      id: 1,
      name: "Original Name",
      description: "Original Description",
      type: FunkoType.POP,
      genre: FunkoGenre.ANIMATION,
      franchise: "Original Franchise",
      number: 1,
      exclusive: false,
      specialFeatures: "None",
      marketValue: 10,
    };

    vi.spyOn(FileManager, "getFunko").mockReturnValue(existingFunko);

    const updates = { marketValue: 20 };
    const result = getUpdatedFunko("user1", 1, updates);

    expect(result).toEqual({
      ...existingFunko,
      marketValue: 20,
    });
  });
});