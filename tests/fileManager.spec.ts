import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { FileManager } from "../src/utils/fileManager.js";
import { Funko, FunkoType, FunkoGenre } from "../src/models/funko.js";
import fs from "fs";
import path from "path";

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

describe("FileManager", () => {
  const userDir = path.join("data", testUser);

  beforeEach(() => {
    // Crear directorio de usuario si no existe
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
  });

  afterEach(() => {
    // Eliminar archivos de prueba después de cada test
    if (fs.existsSync(userDir)) {
      fs.rmSync(userDir, { recursive: true, force: true });
    }
  });

  it("should save a Funko", () => {
    FileManager.saveFunko(testUser, testFunko);
    const filePath = path.join(userDir, `${testFunko.id}.json`);
    expect(fs.existsSync(filePath)).toBe(true);
  });

  it("should load Funkos", () => {
    FileManager.saveFunko(testUser, testFunko);
    const funkos = FileManager.loadFunkos(testUser);
    expect(funkos).toHaveLength(1);
    expect(funkos[0]).toEqual(testFunko);
  });

  it("should get a specific Funko", () => {
    FileManager.saveFunko(testUser, testFunko);
    const funko = FileManager.getFunko(testUser, testFunko.id);
    expect(funko).toEqual(testFunko);
  });

  it("should return null for a non-existing Funko", () => {
    const funko = FileManager.getFunko(testUser, 999);
    expect(funko).toBeNull();
  });

  it("should delete a Funko", () => {
    FileManager.saveFunko(testUser, testFunko);
    const deleted = FileManager.deleteFunko(testUser, testFunko.id);
    expect(deleted).toBe(true);
    expect(FileManager.getFunko(testUser, testFunko.id)).toBeNull();
  });

  it("should return false when deleting a non-existing Funko", () => {
    const deleted = FileManager.deleteFunko(testUser, 999);
    expect(deleted).toBe(false);
  });
});
