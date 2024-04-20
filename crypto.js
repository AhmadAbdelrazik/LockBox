require("dotenv").config();
const {
  createHash,
  scrypt,
  randomFill,
  createCipheriv,
} = require("node:crypto");


const algorithm = process.env.CIPHER_ALGORITHM;
const salt = process.env.CIPHER_SALT;

// Possible to track the IV for each password 
// in the csv file for more security

export async function cipher(password) {
  return new Promise((resolve, reject) => {
    scrypt(process.env.MASTER_PASSWORD_HASH, salt, 24, (err, key) => {
      if (err) reject(err);
      
      const cipher = createCipheriv(algorithm, key, new Uint8Array(16));
      encrypted = cipher.update(password, "utf8", "hex");
      encrypted += cipher.final("hex");

      resolve(encrypted);
    })
  })
}

export function decipher(encrypted) {
  const iv = Buffer.alloc(16, 0); // Initialization vector.
  return new Promise((resolve, reject) => {
    scrypt(process.env.MASTER_PASSWORD_HASH, salt, 24, (err, key) => {
      if (err)  reject(err);

      const decipher = createDecipheriv(algorithm, key, iv);
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
    
      resolve(decrypted)
    })
  })
}


export function hasher(password) {
  const hash = createHash("sha256");
  hash.update(password);
  return hash.digest("hex");
}
