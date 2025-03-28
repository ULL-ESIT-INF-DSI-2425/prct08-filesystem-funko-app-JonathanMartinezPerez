import * as path from 'path';
import { rename, mkdir, readdir, stat } from 'node:fs';

/**
 * Lista los archivos de un directorio, incluyendo información sobre su tamaño y fecha de modificación.
 * @param dirPath Ruta del directorio a listar.
 */
function listFilesInDirectory(dirPath: string): void {
  readdir(dirPath, (err, files: string[]) => {
    if (err) throw err;

    const fileDetails: { name: string; size: number; modified: Date }[] = [];
    let pending = files.length;

    if (!pending) throw err;
    // Si no hay archivos, se llama al callback inmediatamente
    if (pending === 0) {
      console.log("No hay archivos en el directorio.");
      return;
    }
    // Itera sobre cada archivo en el directorio
    files.forEach((file) => {
      const filePath = path.join(dirPath, file);
      stat(filePath, (err, stats) => {
        if (err) throw err;;

        fileDetails.push({
          name: file,
          size: stats.size,
          modified: stats.mtime,
        });

        if (!--pending) {
          // Cuando todos los archivos han sido procesados, se imprime el resultado
          console.log("Detalles de los archivos:", fileDetails);
        }
      });
    });
  });
}

/**
 * Elimina un archivo de manera segura, moviéndolo a un directorio de reciclaje.
 * @param filePath Ruta del archivo a eliminar.
 * @param recycleBinPath Ruta del directorio de reciclaje.
 */
function moveToRecycleBin(filePath: string, recycleBinPath: string): void {
  const fileName = path.basename(filePath);
  const destination = path.join(recycleBinPath, fileName);

  mkdir(recycleBinPath, { recursive: true }, (err) => { 
    if (err) throw err;

    rename(filePath, destination, (err) => {
      if (err) throw err;
      console.log(`Archivo ${fileName} movido a la papelera.`);
    });
  });
}

/**
 * Mueve un archivo a un nuevo directorio, creando el directorio si no existe.
 * @param filePath Ruta del archivo a mover.
 * @param destPath Ruta del directorio de destino.
 */
function moveDirectoryFile(filePath: string, destPath: string): void {
  const fileName = path.basename(filePath);
  const destinationPath = path.join(destPath, fileName);

  mkdir(destPath, { recursive: true }, (err) => {
    if (err) throw err;

    rename(filePath, destinationPath, (err) => {
      if (err) throw err;
      console.log(`Archivo ${fileName} movido a ${destPath}.`); 
    });
  });
}

/**
 * Busca archivos por extensión en un directorio y sus subdirectorios.
 * @param dirPath Ruta del directorio a buscar.
 * @param extension Extensión de archivo a buscar (por ejemplo, ".txt").
 */
function findFilesByExtension(dirPath: string, extension: string): void {
  readdir(dirPath, (err, files: string[]) => {
    if (err) throw err;

    const foundFiles: string[] = [];
    let pending = files.length;

    if (!pending) throw err;
    // Si no hay archivos, se llama al callback inmediatamente
    if (pending === 0) {
      console.log("No se encontraron archivos.");
      return;
    }
    // Itera sobre cada archivo en el directorio
    files.forEach((file) => {
      const filePath = path.join(dirPath, file);
      stat(filePath, (err, stats) => {
        if (err) throw err;

        if (stats.isDirectory()) {
          findFilesByExtension(filePath, extension); // Llama recursivamente para subdirectorios
        } else if (path.extname(file) === extension) {
          foundFiles.push(filePath);
        }

        if (!--pending) {
          // Cuando todos los archivos han sido procesados, se imprime el resultado
          console.log(`Archivos encontrados con la extensión ${extension}:`, foundFiles);
        }
      });
    });
  });
}

//-------------------------------------PRUEBAS------------------------------------//

// FUNCIONA
listFilesInDirectory("/home/usuario/prct08-filesystem-funko-app-JonathanMartinezPerez/src");

// FUNCIONA
moveToRecycleBin(
  "/home/usuario/prct08-filesystem-funko-app-JonathanMartinezPerez/src/example.txt", 
  "/home/usuario/prct08-filesystem-funko-app-JonathanMartinezPerez/recycle-bin"
);

// FUNCIONA
moveDirectoryFile(
  "/home/usuario/prct08-filesystem-funko-app-JonathanMartinezPerez/src/prueba", 
  "/home/usuario/prct08-filesystem-funko-app-JonathanMartinezPerez/destination"
);

// FUNCIONA
findFilesByExtension(
  "/home/usuario/prct08-filesystem-funko-app-JonathanMartinezPerez/src", 
  ".ts"
);