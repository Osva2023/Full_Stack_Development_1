// Import the contact controller, express, and the contact data validation middleware
const contactController = require('../features/contact/contact.controller');
const express = require('express');
const router = express.Router();
const {validateContactData} = require('../shared/middleware/contact.middleware');

// Define a function to register the contact routes
const registerContactRoutes = (app) => {
    app.post('/contact-us', validateContactData, contactController.storageContactUs);
}
// Export the 'registerContactRoutes' function
module.exports = {registerContactRoutes};