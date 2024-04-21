const { parse } = require("csv-parse");
const fs = require("fs/promises");

async function getData() {
  const records = [];
  const myMap = new Map();
  
  const parser = parse({
    delimiter: '='
  })
  
  parser.on('readable', () => {
    let record;
    while ((record = parser.read()) !== null) {
      records.push(record);
    }
  });

  let data = await fs.readFile('.data.csv', {encoding: "utf8"});
  parser.write(data);
  parser.end();
  
  for (item of records) {
    myMap[item[0]] = item[1];
  }
  
  return myMap;
}

async function updatePasswords(myMap) {
  fs.writeFile(".data.csv", ``);
  for (const it in myMap) {
    fs.appendFile(".data.csv", `${it}=${myMap[it]}\n`);
  }
}

exports.updatePasswords = updatePasswords;
exports.getData = getData;