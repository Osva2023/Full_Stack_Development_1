const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Agent = require('./agent.Schema')

const RegionSchema = new mongoose.Schema({
    region: {
        type: String,
        enum:{
            values:['north', 'south', 'east', 'west'],
            message: '{VALUE} is not supported'
        },
        required: true
    },
    address: {
        type: String,
        // trim: true,
        required: true
    },
    total_sales: { 
        type: Number,
        min: 0
    },
    manager: [Agent.schema],
    top_agents: [Agent.schema]

}, { timestamps: true })

module.exports = mongoose.model('Region', RegionSchema)