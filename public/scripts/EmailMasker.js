** start of script.js **

function maskEmail(email){
  const atIndex = email.indexOf('@');
  const firstLetter = email.slice(0,1);
  const lastLetterAndDomain = email.slice(atIndex-1);
  const toMask = email.slice(1,atIndex-1);
  const maskedEmail = firstLetter + '*'.repeat(toMask.length)+ lastLetterAndDomain;
  return maskedEmail;

}

let email = "examplemail@domain.com";
console.log(maskEmail(email));


** end of script.js **
