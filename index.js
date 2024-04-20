const { program } = require("commander");
const { createHash } = require("node:crypto");
const fs = require("fs/promises");
require("dotenv").config();

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
// Used if tried to access later
// if (process.env.MASTER_PASSWORD_HASH === hasher(0)) {
// console.log("You have to set a password");
// }

program.name("lockbox").description("CLI to Manage passwords").version("0.0.1");

/* 
1. Command to setup the master key.
  - Confirm the master key.
  - hash it and save it.

2. Command to Change the master key.

3. Command to Reset all passwords in the LockBox.
*/

program
  .command("set-password")
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

program.parse();
