//IMPORT THE 'VALIDATOR LIBRARY' FOR DATA VALIDATION
const validator = require('validator');

//DEFINE A MIDDLEWARE FUNCTION TO VALIDATE THE CONTACT DATA
const validateContactData = (req, res, next) => {
  const { email, phone } = req.body;

  // VALIDATE THE EMAIL FIELD
  if (!validator.isEmail(email)) {
    res.status(400).json({ msg: 'Invalid email address' });
    return;
  }

  // VALIDATE THE PHONE FIELD
  if (!validator.isMobilePhone(phone, 'any', { strictMode: false })) {
    res.status(400).json({ msg: 'Invalid phone number' });
    return;
  }

  // IF ALL FIELDS ARE VALID, PROCEED TO THE NEXT MIDDLEWARE OR ROUTE HANDLER
  next();
};
// EXPORT THE 'validateContactData' FUNCTION
module.exports = { validateContactData };
