const fs = require('fs');
module.exports = function (filePath) {
  // Return error message if file does not exist
  if (!fs.existsSync(filePath)) {
    return 'Invalid file';
  }

  // Transforming bill into a string
  const data = fs.readFileSync(filePath).toString();

  // Finding the customer and account number
  const custNumber = data.match(/(?<=no.\s+)\d+.*/)[0];

  // Finding the bill period
  const billPeriod = data.match(/\w+ \d+, \w+ to.*/)[0];

  // Finding the bill number
  const billNumber = data.match(/Bill number.*/)[0];

  // Finding the bill date
  const billDate = data.match(/Bill date.*/)[0];

  // Finding the total new charges
  const charges = +data.match(/(?<=new charges.*)\d\S*/)[0].replace(/,/g, '');

  // Returns required information in a list format
  return `1. Customer No. - Account no.: ${custNumber}
2. Bill period: ${billPeriod}
3. ${billNumber}
4. ${billDate}
5. Total new charges: ${charges}`;
};
