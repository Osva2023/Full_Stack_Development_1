const validator = require('validator');

// MIDDLEWARE TO VALIDATE REGION INPUT FIELDS
const validateRegionInput = (req, res, next) => {
    const region = req.query.region;

    if (region && region.toLowerCase() === 'all') {
        next();
    } else {
        const validRegions = ['north', 'south', 'east', 'west'];
        if (!validRegions.includes(region.toLowerCase())) {
            res.status(400).json({ error: 'Invalid region' });
    }
    next();
}
};
//EXPORTING MIDDLEWARE
module.exports = { validateRegionInput };


