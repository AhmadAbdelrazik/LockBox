#!/usr/bin/env node

const { program } = require("commander");
const fs = require("fs/promises");
require("dotenv").config();
const { masterPassword, cipher, decipher, hasher, init } = require("./crypto");
const { getData, updatePasswords } = require("./parse");

let passwords = new Map();

(() => {
  if (masterPassword === "NULL" || masterPassword === undefined) {
    const defaultHash = hasher("0");
    fs.writeFile(".data.csv", ``);
    fs.writeFile(".env", `MASTER_PASSWORD_HASH=${defaultHash}`);
  } else {
    passwords = getData();
  }
})();

/******************/
program.name("lockbox").description("CLI to Manage passwords").version("0.0.1");

/******************/

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
    } else if (hasher(args.old) !== masterPassword) {
      if (masterPassword === undefined) {
        const newHash = hasher(args.new);
        fs.writeFile(".env", `MASTER_PASSWORD_HASH=${newHash}`);
      } else if (args.old === "0")
        console.log(`Provide the old password "-o, --old <string>" `);
      else console.log("Wrong Password.");
    } else if (hasher(args.new) === masterPassword) {
      console.log("New password can't be as the old password");
    } else {
      const newHash = hasher(args.new);
      fs.writeFile(".env", `MASTER_PASSWORD_HASH=${newHash}`);
    }
  });

/******************/

program
  .command("add")
  .description("Add or change a password in the password vault.")
  .requiredOption("-m, --master <string>", "The master Password")
  .requiredOption("-n, --name <string>", "The name assigned to the password")
  .requiredOption("-p, --password <string>", "The password to assign to name")
  .action(async (args) => {
    passwords = await getData();
    if (
      hasher(args.master) !== masterPassword ||
      masterPassword === hasher("0")
    ) {
      if (masterPassword === hasher("0")) {
        console.log("Please assign a master Password");
      } else {
        console.log("Wrong Password, Please Try again");
      }
    } else if (args.name.length < 1 || args.name.length > 30) {
      console.log(`Name should be between 1 and 30: got ${args.name.length}`);
    } else if (args.password.length < 8 || args.password.length > 40) {
      console.log(
        `Password should be between 8 and 40: got ${args.password.length}`
      );
    } else {
      const password = await cipher(args.password);
      passwords[args.name] = password;
      await updatePasswords(passwords);
      console.log(`Password for ${args.name} has been added successfully`);
    }
  });

/******************/

program
  .command("get")
  .description("Get password for a name in the password vault.")
  .requiredOption("-m, --master <string>", "The master Password")
  .requiredOption("-n, --name <string>", "The name assigned to the password")
  .action(async (args) => {
    passwords = await getData();
    if (
      hasher(args.master) !== masterPassword ||
      masterPassword === hasher("0")
    ) {
      if (masterPassword === hasher("0")) {
        console.log("Please assign a master password");
      } else {
        console.log("Wrong Password, Please Try again");
      }
    } else if (passwords[args.name] === undefined) {
      console.log("No such Name");
    } else {
      password = await decipher(passwords[args.name]);
      console.log(`Password for ${args.name} : ${password}`);
    }
  });

program.parse();
