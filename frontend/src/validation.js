function validStr(str, maxLength) {
  if (!str || typeof str !== `string` || str.trim().length === 0) {
    throw `${str} must be a non-empty string`;
  }
  const trimmedStr = str.trim();
  if (trimmedStr.length > maxLength) {
    throw `${trimmedStr} cannot be over ${maxLength} characters long`;
  }
  return trimmedStr;
}

function validateDisplayName(displayName) {
  return validStr(displayName, 50);
}

function validateEmail(email) {
  return validStr(email, 75);
}

function validatePassword(password) {
  return validStr(password, 100);
}

function validateCompanyName(companyName) {
  return validStr(companyName, 50);
}

function validateCity(city) {
  return validStr(city, 50);
}

function validateIndustry(industry) {
  return validStr(industry, 50);
}

function validateSearchInput(searchInput) {
  return validStr(searchInput, 100);
}

function validateJobTitle(jobTitle) {
  return validStr(jobTitle, 100);
}

function validateJobType(jobType) {
  return validStr(jobType, 50);
}

function validateDescription(description) {
  return validStr(description, 5000);
}

function validatePay(pay) {
  return validStr(pay, 50);
}

function validateSkills(skills) {
  return validStr(skills, 300);
}

export {
  validStr,
  validateDisplayName,
  validateEmail,
  validatePassword,
  validateCompanyName,
  validateCity,
  validateIndustry,
  validateSearchInput,
  validateJobTitle,
  validateJobType,
  validateDescription,
  validatePay,
  validateSkills,
};
