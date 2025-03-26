import * as fs from 'fs';
import * as path from 'path';
import { rename,mkdir,readdir,stat} from 'node:fs';

/**
 * Lista los archivos de un directorio, incluyendo información sobre su tamaño y fecha de modificación.
 * @param dirPath Ruta del directorio a listar.
 * @param callback Callback que recibe el resultado o un error.
 */
function listFilesInDirectory(dirPath: string, callback: (err: NodeJS.ErrnoException | null, files?: { name: string; size: number; modified: Date }[]) => void): void {
  fs.readdir(dirPath, (err, files) => {
    if (err) return callback(err);

    const fileDetails: { name: string; size: number; modified: Date }[] = [];
    let pending = files.length;

    if (!pending) return callback(null, fileDetails);

    files.forEach((file) => {
      const filePath = path.join(dirPath, file);
      fs.stat(filePath, (err, stats) => {
        if (err) return callback(err);

        fileDetails.push({
          name: file,
          size: stats.size,
          modified: stats.mtime,
        });

        if (!--pending) callback(null, fileDetails);
      });
    });
  });
}

/**
 * Elimina un archivo de manera segura, moviéndolo a un directorio de reciclaje.
 * @param filePath Ruta del archivo a eliminar.
 * @param recycleBinPath Ruta del directorio de reciclaje.
 * @param callback Callback que recibe el resultado o un error.
 */
export function moveToRecycleBin(filePath: string, recycleBinPath: string, callback: (err: NodeJS.ErrnoException | null) => void): void {
  const fileName = path.basename(filePath);
  const destination = path.join(recycleBinPath, fileName);

  fs.mkdir(recycleBinPath, { recursive: true }, (err) => {
    if (err) return callback(err);

    fs.rename(filePath, destination, (err) => {
      if (err) return callback(err);
      callback(null);
    });
  });
}

function moveDirectoryFile(filePath: string, destPath: string): void {
  const fileName = path.basename(filePath);
  const destinationPath = path.join(destPath, fileName);

  mkdir(destPath, { recursive: true }, (err) => {
    if (err) throw err;
  
    rename(filePath, destinationPath, (err) => {
      if (err) throw err;
        console.log('Movido correctamente!');
      });
    });
}


/**
 * Busca archivos por extensión en un directorio y sus subdirectorios.
 * @param dirPath Ruta del directorio a buscar.
 * @param extension Extensión de archivo a buscar (por ejemplo, ".txt").
 * @param callback Callback que recibe el resultado o un error.
 */
/*
function findFilesByExtension(dirPath: string, extension: string): void {
  let results: string[] = [];

  readdir(dirPath, (err, files) => {
    if (err) throw err;

    let pending = files.length;
    if (!pending) throw err;

    files.forEach((file) => {
      const filePath = path.join(dirPath, file);

      stat(filePath, (err, stats) => {
        if (err) throw err;

        if (stats.isDirectory()) {
          // Recursivamente buscar en subdirectorios
          findFilesByExtension(filePath, extension, (err) => {
            if (err) throw err;

            results = results.concat(res || []);
            if (!--pending) throw err;
          });
        } else {
          if (path.extname(file) === extension) {
            results.push(filePath);
          }
          if (!--pending) throw err;
        }
      });
    });
  });
}
*/
//PRUEBAS

//FUNCIONA
/*
listFilesInDirectory("/home/usuario/prct08-filesystem-funko-app-JonathanMartinezPerez/src", (err, files) => {
  if (err) {
    console.error("Error listing files:", err);
  } else {
    console.log("Files:", files);
  }
});*/

//FUNCIONA 
/*
moveToRecycleBin(
  "/home/usuario/prct08-filesystem-funko-app-JonathanMartinezPerez/src/example.txt", 
  "/home/usuario/prct08-filesystem-funko-app-JonathanMartinezPerez/recycle-bin", 
  (err) => {
    if (err) {
      console.error("Error moving file to recycle bin:", err);
    } else {
      console.log("File successfully moved to recycle bin.");
    }
  }
);*/


/*moveDirectoryFile(
  "/home/usuario/prct08-filesystem-funko-app-JonathanMartinezPerez/src/example.txt", 
  "/home/usuario/prct08-filesystem-funko-app-JonathanMartinezPerez/destination"
);*/

// Ejemplo de uso
/*findFilesByExtension(
  "/home/usuario/prct08-filesystem-funko-app-JonathanMartinezPerez/src",
  ".ts"
);*/