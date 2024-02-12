
const RegionController = require('../features/region/region.controller');

const registerRegionRoutes = (app) => {
  app.post('/region-create', RegionController.createRegion);

  app.get('/region', RegionController.getRegion);

  app.get('/all-stars', RegionController.getAllStars);
}

module.exports = {registerRegionRoutes};