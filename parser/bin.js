// Requires main file from package.json
const billParser = require('.');

// User argument input
const parserFile = process.argv[2];

// Output data
console.log(billParser(parserFile));
