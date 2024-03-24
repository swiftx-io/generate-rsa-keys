import { generateKeyPair } from "crypto";
import fs from "fs";
import path from "path";

export abstract class KeyCrypt {
  static generateRSAKeys = (length: 0.5 | 1 | 2 | 3 | 4 = 2) =>
    new Promise<{
      privateKey: string;
      publicKey: string;
    }>((resolve, reject) =>
      generateKeyPair(
        "rsa",
        {
          modulusLength: length * 1024,
          publicKeyEncoding: {
            type: "spki",
            format: "pem",
          },
          privateKeyEncoding: {
            type: "pkcs8",
            format: "pem",
          },
        },
        (err: Error | null, publicKey: string, privateKey: string) => {
          if (err) {
            reject(err);
          } else {
            console.log(publicKey);
            console.log("------------- Base64 -------------");
            console.log(Buffer.from(publicKey).toString("base64"));
            console.log("==================================");
            console.log(privateKey);
            console.log("------------- Base64 -------------");
            console.log(Buffer.from(privateKey).toString("base64"));
            console.log("==================================");
            resolve({
              privateKey,
              publicKey,
            });
          }
        }
      )
    );

  static async generateAndStoreRSAKeys(
    name: string,
    pathname: string,
    length: 0.5 | 1 | 2 | 3 | 4 = 2
  ) {
    pathname = `../${pathname}`;
    // const __dirname = dirname(fileURLToPath(import.meta.url));
    const folder = path.resolve(__dirname, pathname);
    fs.mkdirSync(folder, { recursive: true });

    const pupPath = path.resolve(__dirname, `${pathname}/${name}.pub.pem`);
    const keyPath = path.resolve(__dirname, `${pathname}/${name}.key.pem`);
    if (!fs.existsSync(pupPath) || !fs.existsSync(keyPath)) {
      const { privateKey, publicKey } = await this.generateRSAKeys(length);
      const pubFile = fs.createWriteStream(pupPath);
      pubFile.write(publicKey);
      pubFile.end();

      const keyFile = fs.createWriteStream(keyPath);
      keyFile.write(privateKey);
      keyFile.end();

      console.log(`${name} => created`);
      console.log(publicKey);
      console.log("------------- Base64 -------------");
      console.log(Buffer.from(publicKey).toString("base64"));
      console.log("==================================");
      console.log(privateKey);
      console.log("------------- Base64 -------------");
      console.log(Buffer.from(privateKey).toString("base64"));
      console.log("==================================");
      return { privateKey, publicKey };
    }

    console.log(`${name} => ready`);
  }
}
