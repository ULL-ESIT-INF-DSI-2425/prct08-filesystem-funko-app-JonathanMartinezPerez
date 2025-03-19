import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { FileManager } from "../src/utils/fileManager.js";
import { Funko, FunkoType, FunkoGenre } from "../src/models/funko.js";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const testUser = "testUser";
const testFunkoId = 1;

describe("add command", () => {
  const userDir = path.join("data", testUser);

  beforeEach(() => {
    // Crear directorio si no existe
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
  });

  afterEach(() => {
    // Eliminar datos de prueba
    if (fs.existsSync(userDir)) {
      fs.rmSync(userDir, { recursive: true, force: true });
    }
  });

  it("should add a Funko successfully", () => {
    const command = `node dist/index.js add --user ${testUser} --id ${testFunkoId} --name "Test Funko" --description "A test Funko" --type "Pop!" --genre "Videojuegos" --franchise "Test Franchise" --number 100 --exclusive false --specialFeatures "None" --marketValue 50`;
    execSync(command);

    const filePath = path.join(userDir, `${testFunkoId}.json`);
    expect(fs.existsSync(filePath)).toBe(true);
  });

  it("should not add a duplicate Funko", () => {
    const command = `node dist/index.js add --user ${testUser} --id ${testFunkoId} --name "Test Funko" --description "A test Funko" --type "Pop!" --genre "Videojuegos" --franchise "Test Franchise" --number 100 --exclusive false --specialFeatures "None" --marketValue 50`;
    execSync(command);
    let errorThrown = false;
    try {
      execSync(command);
    } catch (error) {
      errorThrown = true;
    }
    expect(errorThrown).toBe(false);
  });
});
