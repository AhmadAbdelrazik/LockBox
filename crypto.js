require("dotenv").config();
const {
  createHash,
  scrypt,
  randomFill,
  createCipheriv,
  createDecipheriv
} = require("node:crypto");

const algorithm = "aes-192-cbc";
const salt = "FREEPALESTINE";
const masterPassword = process.env.MASTER_PASSWORD_HASH;


async function cipher(password) {
  return new Promise((resolve, reject) => {
    scrypt(masterPassword, salt, 24, (err, key) => {
      if (err) reject(err);

      const cipher = createCipheriv(algorithm, key, new Uint8Array(16));
      encrypted = cipher.update(password, "utf8", "hex");
      encrypted += cipher.final("hex");

      resolve(encrypted);
    });
  });
}

function decipher(encrypted) {
  const iv = Buffer.alloc(16, 0); // Initialization vector.
  return new Promise((resolve, reject) => {
    scrypt(masterPassword, salt, 24, (err, key) => {
      if (err) reject(err);

      const decipher = createDecipheriv(algorithm, key, iv);
      let decrypted = decipher.update(encrypted, "hex", "utf8");
      decrypted += decipher.final("utf8");
      
      resolve(decrypted);
    });
  });
}

function hasher(password) {
  const hash = createHash("sha256");
  hash.update(password);
  return hash.digest("hex");
}

  
exports.masterPassword = masterPassword;
exports.hasher = hasher;
exports.decipher = decipher;
exports.cipher = cipher;