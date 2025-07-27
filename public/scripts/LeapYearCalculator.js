** start of script.js **

function isLeapYear(year) {
  // A year is NOT a leap year if:
  // - it's divisible by 100 but NOT divisible by 400
  if (Number.isInteger(year / 100) && !Number.isInteger(year / 400)) {
    return `${year} is not a leap year.`;
  }
  // Otherwise, check if it's divisible by 4
  else if (Number.isInteger(year / 4)) {
    return `${year} is a leap year.`;
  }
  // If none of the above, it's not a leap year
  else {
    return `${year} is not a leap year.`;
  }
}
  
let year ="2025";
const result = isLeapYear(year);
console.log(result);

** end of script.js **
