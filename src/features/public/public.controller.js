const { validate } = require('../../shared/db/mongodb/schemas/agent.Schema');
const Data = require('../../shared/resources/data');
const validator = require('validator');

const contactUs = (req,res) => {
  const firstName = req.body.first_name;
  const lastName = req.body.last_name;
  const message = req.body.message;

  const responseMessage = `Message received from ${firstName} ${lastName}`;

  console.log(responseMessage);
  res.send(responseMessage);
};
// Function to calculate the quote for a building
const calculateQuote = (req,res) => { 

  const tier = req.query.tier.toLowerCase();
  const typeofBuilding = req.params.type.toLowerCase();

  try {
    validateBuildingType(typeofBuilding);
    
    let numElevators, fee, finalPrice;
  
    if (typeofBuilding == 'residential') {
      validateNumericInputs(req.query, ['floors', 'apts']);

      const apts = +req.query.apts;
      const floors = +req.query.floors;

      numElevators = calcResidentialElev(floors, apts);
      fee = calcInstallFee(numElevators, tier);
      finalPrice = calculateTotalPrice(numElevators, tier);
    
    } else if (typeofBuilding == 'commercial') {
      validateNumericInputs(req.query, ['floors', 'occupancy']);

      const floors = +req.query.floors;
      const occupancy = +req.query.occupancy;

      numElevators = calcCommercialElev(floors, occupancy);
      fee = calcInstallFee(numElevators, tier);
      finalPrice = calculateTotalPrice(numElevators, tier);
  
    } else if (typeofBuilding == 'industrial') {
      validateNumericInputs(req.query, ['elevators']);
      const numElevators = +req.query.elevators;

        
      fee = calcInstallFee(numElevators, tier);
      finalPrice = calculateTotalPrice(numElevators, tier);
  } 

    res.send({
      elevators_required: numElevators,
      price_per_elevator: Data.unitPrices[tier],
      installation_fee: fee,
      final_price: finalPrice
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};
// Function to calculate the number of elevators required for a residential building
const calcResidentialElev = (floors, apts) => {
  const elevatorsRequired = Math.ceil(apts / floors / 6)*Math.ceil(floors / 20);
  return elevatorsRequired;
};
// Function to calculate the number of elevators required for a commercial building
const calcCommercialElev = (floors, occupancy) => {
  const elevatorsRequired = Math.ceil((occupancy * floors) / 200)*Math.ceil(floors / 10);
  const freighElevatorsRequired = Math.ceil(floors / 10);
  return freighElevatorsRequired + elevatorsRequired;
};
// Function to calculate the installation fee based on the number of elevators and the tier
const calcInstallFee = (numElevators, tier) => {
  const unitPrice = Data.unitPrices[tier];
  const installPercentFees = Data.installPercentFees[tier];  
  const installationFee = numElevators * unitPrice * installPercentFees/100;
  return installationFee;
};
// Function to calculate the total price based on the number of elevators and the tier
const calculateTotalPrice = (numElevators, tier) => {
  const unitPrice = Data.unitPrices[tier];
  const installationFee = calcInstallFee(numElevators, tier);
  const totalPrice = numElevators * unitPrice + installationFee;
  return totalPrice;
};
// Function to validate the building type
const validateBuildingType = (type) => {
  const allowedTypes = ['residential', 'commercial', 'industrial'];
  if(!validator.isIn(type, allowedTypes)){
    throw new Error('Error: Invalid building type');
  }
};
// Function to validate numeric inputs
const validateNumericInputs = (query, fields) => {
  fields.forEach(fieldName => {
    const value = +query[fieldName];
    if (!validator.isInt(value.toString(), {min: 1})) {
      throw new Error(`Error: Invalid value for ${fieldName}`);
    }
  });
};


// Export the contactUs and calculateQuote functions
module.exports = {contactUs,calculateQuote};