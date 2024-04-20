const { program } = require("commander");
const {
  createHash,
  scrypt,
  randomFill,
  createCipheriv,
} = require("node:crypto");
const fs = require("fs/promises");
require("dotenv").config();



// Used for Ciphering and Deciphering.

const algorithm = process.env.CIPHER_ALGORITHM;
const salt = process.env.CIPHER_SALT;

// Possible to track the IV for each password 
// in the csv file for more security

async function cipher(password) {
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

function decipher(encrypted) {
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


function hasher(password) {
  const hash = createHash("sha256");
  hash.update(password);
  return hash.digest("hex");
}

if (
  process.env.MASTER_PASSWORD_HASH === "NULL" ||
  process.env.MASTER_PASSWORD_HASH === undefined
) {
  const defaultHash = hasher("0");
  fs.writeFile(".env", `MASTER_PASSWORD_HASH=${defaultHash}`);
}

program.name("lockbox").description("CLI to Manage passwords").version("0.0.1");

/* 
1. Command to setup the master key.
  - Confirm the master key.
  - hash it and save it.

2. Command to Change the master key.

3. Command to Reset all passwords in the LockBox.
*/

program
  .command("set-master")
  .description("Set or change the master password")
  .requiredOption("-o, --old <string>", "The old master password", "0")
  .requiredOption("-n, --new <string>", "The new master password")
  .action((args) => {
    if (args.new.length < 8) {
      console.log(
        `new password must be more than 8 characters: got ${args.new.length}`
      );
    } else if (args.new.length > 40) {
      console.log(
        `new password must be less than 40 characters: got ${args.new.length}`
      );
    } else if (hasher(args.old) !== process.env.MASTER_PASSWORD_HASH) {
      if (args.old === "0")
        console.log(`Provide the old password "-o, --old <string>" `);
      else console.log("Wrong Password.");
    } else if (hasher(args.new) === process.env.MASTER_PASSWORD_HASH) {
      console.log("New password can't be as the old password");
    } else {
      const newHash = hasher(args.new);
      fs.writeFile(".env", `MASTER_PASSWORD_HASH=${newHash}`);
    }
  });
  

program
  .command("add")
  .description("Add a password in the password vault.")
  .requiredOption("-m, --master <string>", "The master Password")
  .requiredOption("-n, --name <string>", "The name assigned to the password")
  .requiredOption("-p, --password <string>", "The password to assign to name")
  .action((args) => {

  });

program.parse();
