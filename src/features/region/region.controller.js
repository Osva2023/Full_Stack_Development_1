const Agent = require('../../shared/db/mongodb/schemas/agent.Schema')
const Region = require('../../shared/db/mongodb/schemas/region.Schema')
const asyncWrapper = require('../../shared/util/base-utils')


const createRegion = asyncWrapper( async (req,res) => {
    const region = await Region.create(req.body);
    res.status(201).json({ msg: 'Region created', data: region }); 
});

const getRegion = asyncWrapper( async (req,res) => {
    const regionSelected = req.query.region
    const region = await Region.find({ region: regionSelected.toLowerCase() });
    if (!region.length) {
        return res.status(404).json({ msg:`No region with name ${regionSelected}` })    
    }
    res.status(200).json({ region: regionSelected, data: region });
});


const getAllStars = asyncWrapper( async (req, res) => {
    const north_region = await Region.find({ region: 'north' })
    const south_region = await Region.find({ region: 'south' })
    const east_region = await Region.find({ region: 'east' })
    res.status(200).json({ 
        region1: 'north',
        topAgent_North: north_region[0].top_agents[0],
        region2: 'east',
        topAgent_East: east_region[0].top_agents[0],
        region3: 'south',
        topAgent_South: south_region[0].top_agents[0]
    })
})

module.exports = {
  createRegion,
  getRegion,
  getAllStars,
};